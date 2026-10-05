import requests
from bs4 import BeautifulSoup


def decode_secret_message(url):
  """Retrieves character grid data from a published Google Doc URL and prints the resulting secret message.
  """
  try:
    # 1. Fetch the published Google Doc HTML content
    response = requests.get(url)
    response.raise_for_status()
  except Exception as e:
    print(f'Error fetching URL: {e}')
    return

  # 2. Parse the HTML using BeautifulSoup
  soup = BeautifulSoup(response.text, 'html.parser')

  # 3. Find the main data table
  table = soup.find('table')
  if not table:
    print('Error: No table found in the document.')
    return

  rows = table.find_all('tr')
  if not rows:
    return

  # 4. Identify column indices dynamically from the header row
  header_cells = [
      cell.get_text(strip=True).lower() for cell in rows[0].find_all(['td', 'th'])
  ]

  x_idx = -1
  y_idx = -1
  char_idx = -1

  for idx, header in enumerate(header_cells):
    if 'x' in header:
      x_idx = idx
    elif 'y' in header:
      y_idx = idx
    elif 'character' in header or 'char' in header:
      char_idx = idx

  # Default fallback if headers are missing
  if x_idx == -1 or y_idx == -1 or char_idx == -1:
    x_idx, char_idx, y_idx = 0, 1, 2

  # 5. Extract coordinates and characters into a dictionary
  grid = {}
  max_x = 0
  max_y = 0

  for row in rows[1:]:
    cells = [cell.get_text(strip=True) for cell in row.find_all(['td', 'th'])]
    if len(cells) <= max(x_idx, y_idx, char_idx):
      continue

    try:
      x = int(cells[x_idx])
      char = cells[char_idx]
      y = int(cells[y_idx])

      grid[(x, y)] = char

      if x > max_x:
        max_x = x
      if y > max_y:
        max_y = y
    except (ValueError, IndexError):
      continue

  # 6. Print the grid from top (max_y) to bottom (0)
  print('\n--- DECODED SECRET MESSAGE ---')
  for y in range(max_y, -1, -1):
    row_chars = []
    for x in range(0, max_x + 1):
      row_chars.append(grid.get((x, y), ' '))
    print(''.join(row_chars))
  print('-------------------------------\n')


# --- USER INPUT & AUTOMATIC FUNCTION CALL ---
if __name__ == '__main__':
  # Program asks user for URL input
  user_url = input('Please paste the Google Doc URL: ').strip()

  # Automatically calls the function if input is provided
  if user_url:
    decode_secret_message(user_url)
  else:
    print('No URL provided!')