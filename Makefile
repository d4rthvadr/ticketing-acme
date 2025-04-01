start-skaffold:
	skaffold dev # This will start the skaffold dev process
tests-ci:
	cd $(SVC) && npm install && npm run test:ci	


# Alias for long commands
ss: start-skaffold
