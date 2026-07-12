# TransitOps Common Package

Shared utilities for all TransitOps microservices.

## Installation

```bash
npm install ../common
```

## Usage

```javascript
const {
    authenticate,
    authorize,
    jwt,
    ROLES,
    ApiResponse
} = require("@transitops/common");
```

Example:

```javascript
router.post(
    "/",
    authenticate,
    authorize(
        ROLES.FLEET_MANAGER,
        ROLES.DISPATCHER
    ),
    controller
);
```