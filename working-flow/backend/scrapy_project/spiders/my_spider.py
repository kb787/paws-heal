import scrapy
from bs4 import BeautifulSoup
import html2text
import os
from urllib.parse import urlparse
import logging
import uuid
from datetime import datetime


class MySpider(scrapy.Spider):
    name = "my_spider"

    def __init__(
        self,
        start_urls,
        depth_limit=None,
        output_dir=None,
        excluded_domains=None,
        excluded_keywords=None,
        remove_selectors=None,
        mode="scrape",
        *args,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        self.output_dir = output_dir
        self.md_dir = os.path.join(self.output_dir, "md")
        self.crawled_urls_dir = os.path.join(self.output_dir, "crawled_urls")
        self.start_urls = start_urls
        self.depth_limit = depth_limit if mode == "crawl" else None
        self.excluded_domains = excluded_domains or []
        self.excluded_keywords = excluded_keywords or []
        self.remove_selectors = remove_selectors or self.get_remove_selectors()
        self.mode = mode
        self.crawled_urls = set()
        self.crawled_data = []

    def parse(self, response):
        if not response.url.startswith(("http://", "https://")):
            self.logger.warning(f"Invalid URL skipped: {response.url}")
            return

        self.crawled_urls.add(response.url)
        self.logger.info(f"Crawled URL: {response.url}")

        if (
            response.headers.get("Content-Type", b"")
            .decode("utf-8")
            .startswith("text/html")
        ):
            soup = BeautifulSoup(response.text, "html.parser")
            self.clean_html(soup)
            html_content = str(soup)
            markdown_content = self.convert_html_to_markdown(html_content)

            if self.mode == "scrape":
                self.crawled_data.append(
                    {
                        "url": response.url,
                        "title": self.get_page_title(response.body),
                        "cleaned_markdown": markdown_content,
                    }
                )
                self.save_markdown(response.url, markdown_content, response.text)

            current_depth = response.meta.get("depth", 0)
            if self.mode == "crawl" and (
                self.depth_limit is None or current_depth < self.depth_limit
            ):

                # Check for PDF links
                pdf_links = response.css('a[href$=".pdf"]::attr(href)').getall()
                for pdf_link in pdf_links:
                    absolute_pdf_url = response.urljoin(pdf_link)
                    self.logger.info(f"Found PDF URL: {absolute_pdf_url}")
                    # You can choose to save this PDF URL in your crawled data or log it
                    self.crawled_data.append(
                        {
                            "url": absolute_pdf_url,
                            "title": "PDF Document",
                            "cleaned_markdown": f"[Download PDF]({absolute_pdf_url})",
                        }
                    )
                for href in response.css("a::attr(href)").getall():
                    absolute_url = response.urljoin(href)
                    if (
                        absolute_url.startswith(("http://", "https://"))
                        and absolute_url not in self.crawled_urls
                        and self.is_valid_url(absolute_url)
                    ):
                        yield scrapy.Request(
                            url=absolute_url,
                            callback=self.parse,
                            meta={"depth": current_depth + 1},
                        )

    def clean_html(self, soup):
        for selector in self.remove_selectors:
            for element in soup.select(selector):
                element.decompose()

    def convert_html_to_markdown(self, html_content):
        converter = html2text.HTML2Text()
        converter.ignore_links = False
        return converter.handle(html_content)

    def get_page_title(self, html_content):
        soup = BeautifulSoup(html_content, "html.parser")
        title = soup.find("title")
        return title.text.strip() if title else "No title found"

    def is_valid_url(self, url):
        parsed_url = urlparse(url)
        return not any(
            domain in parsed_url.netloc for domain in self.excluded_domains
        ) and not any(
            keyword.lower() in parsed_url.path.lower()
            for keyword in self.excluded_keywords
        )

    def save_crawled_urls(self):
        file_name = os.path.join(
            self.crawled_urls_dir,
            f"{urlparse(self.start_urls[0]).netloc}_crawled_urls.txt",
        )
        os.makedirs(os.path.dirname(file_name), exist_ok=True)
        with open(file_name, "w", encoding="utf-8") as f:
            for url in self.crawled_urls:
                f.write(url + "\n")

    def close(self, reason):
        if self.mode == "crawl":
            self.save_crawled_urls()

        self.logger.info("Spider closed.")

    def save_markdown(self, url, markdown_content, html_content):

        file_name = os.path.join(self.md_dir, f"{urlparse(url).netloc}.md")
        try:
            with open(file_name, "w", encoding="utf-8") as f:
                f.write(f"URL: {url}\n")
                f.write(f"Title: {self.get_page_title(html_content)}\n")
                f.write(f"Content:\n{markdown_content}\n")
        except Exception as e:
            self.logger.error(f"Failed to save markdown for {url}: {str(e)}")

    def get_remove_selectors(self):
        return [
            "header",
            "footer",
            "nav",
            "aside",
            ".navigation",
            ".menu",
            ".navbar",
            ".topbar",
            ".sidebar",
            ".site-nav",
            '[class*="menu"]',
            '[class*="nav"]',
            '[class*="navigation"]',
            '[class*="header"]',
            '[class*="footer"]',
            ".site-header",
            ".site-footer",
            ".widget",
            ".comment",
            ".comments",
            ".advertisement",
            ".ad",
            ".advert",
            ".breadcrumbs",
            ".search",
            ".subscribe",
            ".newsletter",
            ".related",
            ".suggestions",
            ".share",
            ".social",
            ".video-player",
        ]
