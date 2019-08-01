if [ $1 = "create" ]; then
        mkdir ~/test
	if [ $? -eq 0 ]; then
    	echo "-Successfully  created directory"
    	exit 0
 
	else
    	>&2 echo "Error: Failed creating directory"
    	exit 1
	fi
 
elif [ $1 = "delete" ]
then
   	rm -rf ~/test
        if [ $? -eq 0 ]; then
        echo "-Successfully deleted directory"
        exit 0
 
        else
        >&2 echo "Error: Failed deleting directory"
        exit 1
        fi
 
else
  echo "Invalid argument"
  exit 1
 
fi
