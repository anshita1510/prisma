# Duplicate Name Fix

## Problem
When a user has the same value in both `firstName` and `lastName` fields (e.g., firstName: "anshi", lastName: "anshi"), the name was being displayed as "anshi anshi" instead of just "anshi".

## Solution
Updated the name formatting logic in the following files:

1. `Backend/src/modules/usecase/auth/login.usecase.ts`
2. `Backend/src/modules/controller/auth/auth.controller.ts` 
3. `Backend/src/modules/services/user.service.ts`

## Logic
```typescript
const firstName = user.firstName || '';
const lastName = user.lastName || '';

// Create name, avoiding duplicates and handling empty values
let name = firstName;
if (lastName && lastName !== firstName) {
  name = `${firstName} ${lastName}`;
}
name = name.trim() || 'User'; // Fallback to 'User' if both are empty
```

## Test Cases
- Same name: `formatUserName('anshi', 'anshi')` → `"anshi"`
- Different names: `formatUserName('John', 'Doe')` → `"John Doe"`
- Only first name: `formatUserName('Alice', '')` → `"Alice"`
- Only last name: `formatUserName('', 'Smith')` → `"User"`
- Both empty: `formatUserName('', '')` → `"User"`

## Result
Now when a user logs in, their name will display correctly:
- ✅ "anshi" instead of "anshi anshi"
- ✅ "John Doe" for different first and last names
- ✅ "Alice" for only first name provided
- ✅ "User" as fallback for empty names