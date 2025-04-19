from together import Together
from dotenv import load_dotenv
load_dotenv()

client = Together() # auth defaults to os.environ.get("TOGETHER_API_KEY")

def format_text_to_excel_structure(text):
    prompt = f"""
You are a powerful AI assistant that extracts clean and structured data from unstructured PDF text.

Given the raw text below, extract all relevant tabular or structured data. This may include things like invoices, lists of items, transaction records, logs, product data, or structured data embedded in paragraphs. 

Follow these rules strictly:
- Remove all irrelevant headers, footers, page numbers, and noise
- Identify key fields (like item, date, quantity, value, etc.)
- Use your best judgment to form a table with appropriate column names
- Return the result in **CSV format** only, no extra text, no comments
- If multiple tables exist, merge them intelligently into one if they share schema

Here is the raw text:
{text}
Example output format (you must adapt this to actual content):

Item,Date,Quantity,Price,Total
Apple,2023-04-01,2,1.00,2.00
Orange,2023-04-01,1,1.50,1.50
...

Output:
"""

    response = client.chat.completions.create(
    model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    messages=[{"role": "user", "content":prompt}]
  )
    
    return response.choices[0].message.content


