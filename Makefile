test:
		@NODE_ENV=test expresso \
		-I lib \
		$(TESTFLAGS) \
		tests/*.test.js
