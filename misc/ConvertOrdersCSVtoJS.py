# -*- coding: utf-8 -*-
"""
Created on Wed Apr  1 17:05:31 2020

@author: craig

We've been using some online order files in our original PsychoPy-derived
web-based MST.  This converts those actual .csv files into the .js ones
we'll be using here
"""

import os, csv, glob

inpath=os.path.join('G:',os.sep,'Shared drives','Stark Lab','MST_Psychopy','InitialPPy_Online_Version','OnlineOrders')
outpath=os.path.join("C:",os.sep,"Users","craig","OneDrive - University of California - Irvine","Documents","cordova_cMST","www","jsOrders")


studyfiles=glob.glob(os.path.join(inpath,"MST*p1_o*csv"))
testfiles=glob.glob(os.path.join(inpath,"MST*p2_o*csv"))

for fname in studyfiles:
    print(fname)
    stim=[]
    cond=[]
    with open(fname,"r") as infile:
        reader=csv.reader(infile,delimiter=',')
        next(reader)
        for row in reader:
            stim.append(row[0])
            cond.append(row[1])
    infile.close()
    outfname=fname.replace('csv','js').replace(inpath,outpath)
    outfile=open(outfname,"w")
    outfile.write('var trial_stim=[\n')
    for i in range(len(cond)):
        outfile.write('  {' + "stim: '{0}', cond: '{1}'".format(stim[i],cond[i]) + '}')
        if i < (len(cond)-1):
            outfile.write(',\n')
        else:
            outfile.write('\n')
    outfile.write(']\n')
    outfile.close()

        
for fname in testfiles:
    print(fname)
    stim=[]
    cond=[]
    lbin=[]
    corr3=[]
    corr2=[]
    with open(fname,"r") as infile:
        reader=csv.reader(infile,delimiter=',')
        next(reader)
        for row in reader:
            stim.append(row[0])
            cond.append(row[1])
            lbin.append(row[2])
            if row[3]=='v':
                corr3.append('0')
                corr2.append('0')
            elif row[3]=='b':
                corr3.append('1')
                corr2.append('2')
            elif row[3]=='n':
                corr3.append('2')
                corr2.append('2')
            else:
                corr3.append('-1')
                corr2.append('-1')
    infile.close()
    outfname=fname.replace('csv','js').replace(inpath,outpath)
    outfile=open(outfname,"w")
    outfile.write('var trial_stim=[\n')
    for i in range(len(cond)):
        outfile.write('  {' + "stim: '{0}', cond: '{1}', lbin: {2}, corr3: {3}, corr2: {4}".format(stim[i],cond[i],lbin[i],corr3[i],corr2[i]) + '}')
        if i < (len(cond)-1):
            outfile.write(',\n')
        else:
            outfile.write('\n')
    outfile.write(']\n')
    outfile.close()

       
        