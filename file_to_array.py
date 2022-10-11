words = []
fileOB = open('10102022.txt','r')
lines = fileOB.read().splitlines()
for line in lines:
    words.extend(line.split())

uniqueWords = []
for a in words:
    if a not in uniqueWords:
        uniqueWords.append(a)



print(uniqueWords)
print(len(uniqueWords))
