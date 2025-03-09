# middlewares.py

from scrapy import signals


class CustomDownloaderMiddleware:

    @classmethod
    def from_crawler(cls, crawler):
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        spider.logger.info("Processing request %s" % request.url)
        return None

    def process_response(self, request, response, spider):
        spider.logger.info("Processing response %s" % response.url)
        return response

    def process_exception(self, request, exception, spider):
        spider.logger.error(
            "Error processing request %s: %s" % (request.url, exception)
        )
        return None

    def spider_opened(self, spider):
        spider.logger.info("Spider opened: %s" % spider.name)
