import pandas as pd
from io import StringIO
import csv
def save_to_excel(csv_text, output_file):
      try:
        df = pd.read_csv(
            StringIO(csv_text),
            quoting=csv.QUOTE_NONE,
            on_bad_lines='skip',  # Skip problematic lines
            engine="python"       # Better error handling than C engine
        )
        df.to_excel(output_file, index=False)
      except Exception as e:
        print("❌ Error while saving to Excel:", e)
        raise e