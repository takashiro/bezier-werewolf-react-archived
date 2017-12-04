#!/bin/bash


JQUERY_LIB=js/lib/jquery-3.2.1.min.js

OUTDIR=build
if [ -n "$1" ]; then
	OUTDIR=$1
fi

if [ ! -d $OUTDIR ]; then
	mkdir $OUTDIR
fi

./node_modules/.bin/babel js --out-dir $OUTDIR/js --ignore $JQUERY_LIB

OTHER_FILES="LICENSE README.md index.htm $JQUERY_LIB"
for file in $OTHER_FILES; do
	cp -f $file "$OUTDIR/$file"
done

cp -rf style $OUTDIR
