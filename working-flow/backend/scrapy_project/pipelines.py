# pipelines.py


class SaveToFilePipeline:
    def process_item(self, item, spider):
        # Open a file in append mode
        with open("scraped_data.txt", "a") as f:
            f.write(f"URL: {item['url']}\n")
            f.write(f"Title: {item['title']}\n")
            f.write(f"Content:\n{item['cleaned_markdown']}\n")
            f.write("=" * 40 + "\n")
        return item
