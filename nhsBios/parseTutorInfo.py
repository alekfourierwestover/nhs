
import pandas as pd
import json

daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

data = pd.ExcelFile("tutorsInfo.xlsx")
weekDaysData = []
allMods = []
for weekDay in daysOfTheWeek:
    curDay = pd.read_excel(data, weekDay)
    weekDaysData.append(curDay)
    allMods += curDay["Mod"].tolist()
    
with open("Mods.json", "w") as f:
    json.dump(allMods, f)

modData = {}
for weekDay in range(len(daysOfTheWeek)):
    for mod in range(len(weekDaysData[weekDay]["Mod"])):
        curRow = weekDaysData[weekDay].iloc[mod]
        tutor = curRow["Tutor"]
        subjects = curRow["Subjects"]
        modName = curRow["Mod"]
        if type(tutor) == str:
            modData[modName] = [tutor, subjects]

with open("ModTutors.json", "w") as f:
    json.dump(modData, f)


tutorData = {}

for weekDay in range(len(daysOfTheWeek)):
    for mod in range(len(weekDaysData[weekDay]["Mod"])):
        curRow = weekDaysData[weekDay].iloc[mod]
        tutor = curRow["Tutor"]
        subjects = curRow["Subjects"]
        modName = curRow["Mod"]
        if type(tutor) == str:
            tutorData[tutor] = [modName, subjects]

with open("tutorData.json", "w") as f:
    json.dump(tutorData, f)


