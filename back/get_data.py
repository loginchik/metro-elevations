import json 
import re
from bs4 import BeautifulSoup


# Downloaded from https://ru.wikipedia.org/wiki/Список_станций_Московского_метрополитена (21.08.2024)
# Deleted unnecessary data from body 
with open('wikipage.html', 'r') as source_file:
    soup = BeautifulSoup(source_file.read(), 'html.parser')

# Total list of stations 
stations = []

# Table element 
table = soup.find('table').find('tbody')

# Iterating over rows in table 
for i, row in enumerate(table.find_all('tr')):

    # Iteration over cells in row 
    data_pieces = row.find_all('td')
    # If data is empty, skip this row 
    if len(data_pieces) == 0:
        continue
    
    # This station data piece 
    station_data = dict()
    station_data['no'] = i

    # Get line number 
    station_data['line'] = data_pieces[0].get('data-sort-value', None)

    # Get Station name 
    try:
        name = data_pieces[1].find('span').text.strip()
    except AttributeError:
        name = data_pieces[1].text.strip()
    station_data['name'] = name.replace('ё', 'е')

    # Get elevation level underground 
    z_raw = re.sub(r'\[\d+\]', '', data_pieces[4].text.strip())
    z = re.sub(r'[^\d\+\-\.\,\−]', '', z_raw).replace('−', '-').replace(',', '.')
    # Convert to float, if present, else 0
    z = float(z) if z != '' else 0
    station_data['position_z'] = z

    # Get coordinates 
    coordinates = data_pieces[6].find('span', {'class': 'coordinates'}).get('data-param', None)
    if re.match(r'\d+\.\d+', coordinates):
        lat, lon = list(map(float, re.match(r'(\d+\.\d+)_N_(\d+\.\d+)', coordinates).groups()))
    else:
        lat, _, lon, _ = re.match(r'(\d+_\d+_\d+(\.\d+)?)_N_(\d+_\d+_\d+(\.\d+)?)', coordinates).groups()
        # Convert values 
        degrees, minutes, seconds = list(map(float, lat.split('_')))
        lat = degrees + minutes / 60 + seconds / 3600
        degrees, minutes, seconds = list(map(float, lon.split('_')))
        lon = degrees + minutes / 60 + seconds / 3600
    station_data['position_x'] = lon
    station_data['position_y'] = lat

    stations.append(station_data)

with open('../web/public/stations.json', 'w', encoding='utf-8') as output_file:
    json.dump(stations, output_file, ensure_ascii=False, indent=4)


connections = []
connection_id = 1
for station in stations:
    current_id = station['no']
    current_line = station['line']
    
    for station_other in stations:
        if station_other['line'] == current_line and station_other['no'] == current_id + 1:
            connections.append({
                'id': connection_id,
                'from': current_id, 
                'to': station_other['no'],
                'type': 'train', 
                'line': current_line
            })
            connection_id += 1


with open('../web/public/connections.json', 'w', encoding='utf-8') as output_file:
    json.dump(connections, output_file, ensure_ascii=False, indent=4)