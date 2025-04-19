import time
from ai_cleaner import format_text_to_excel_structure
import pdfplumber
# from get_text import extract_pdf_text
def extract_text_by_pages(pdf_path, chunk_size=10):
    with pdfplumber.open(pdf_path) as pdf:
        all_chunks = []
        total_pages = len(pdf.pages)
        for i in range(0, total_pages, chunk_size):
            chunk_text = ""
            for j in range(i, min(i + chunk_size, total_pages)):
                page = pdf.pages[j]
                page_text = page.extract_text()
                if page_text:
                    chunk_text += page_text + "\n"
            all_chunks.append(chunk_text)
        return all_chunks
def process_full_pdf(pdf_path):
    chunks = extract_text_by_pages(pdf_path)
    full_csv = ""

    for idx, chunk in enumerate(chunks):
        print(f"Processing chunk {idx+1} of {len(chunks)}")
        try:
            csv_part = format_text_to_excel_structure(chunk)
            full_csv += csv_part + "\n"
        except Exception as e:
            print(f"Error processing chunk {idx+1}: {e}")
        time.sleep(1)  # Optional: avoid rate limiting

    return full_csv