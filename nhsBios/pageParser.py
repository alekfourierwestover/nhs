
from bs4 import BeautifulSoup
import json

with open("names.json", "r") as f:
    names = json.load(f)

#  with open("NHSBios20182019.html", "r") as f:
with open("formattedNHSBios.html", "r") as f:
    data = f.read().strip() 
data = BeautifulSoup(data, features="lxml")
data = data.body
all_tags = [tag for tag in data.children]
partitioned_tags = [[]]
page_break_tag= '<hr style="page-break-before:always;display:none;"/>'

for tag in all_tags:
    if tag.name != "hr":
        partitioned_tags[-1].append(tag)
    else:
        partitioned_tags.append([])

separate_people = []
for part in partitioned_tags:
    current_person = ""
    for tag in part:
        stag = str(tag)
        if page_break_tag in stag:
            stags = stag.split(page_break_tag)
            current_person += stags[0]
            current_person += stags[1]
            separate_people.append(current_person)
            current_person = ""
        else:
            current_person += stag
    separate_people.append(current_person)

print(names)
total = ""
for i in range(len(separate_people)):
    curId = str(i)
    for name in names:
        if name in separate_people[i]: 
            curId = name
            curId = curId.replace(" ", "_")
            break
    if curId == str(i):
        print(separate_people[i])

    total += f'<div style="display:none" class="row" id="{curId}">\n'
    total += '<div class="col col-11">\n'
    total += separate_people[i]
    total += "</div>\n"
    total += '<div class="col-1">\n'
    total += f"<button onclick='window.scrollTo(0,document.body.scrollHeight);'>Schedule<br>Appointment<br>With<br>{curId.replace('_',' ')}</button> "
    total += '</div>'
    total += '\n</div>'
    total += "\n\n\n\n\n"

with open("split_bios.html", "w") as f:
    f.write(total)

