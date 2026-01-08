// Test script to verify name formatting logic
function formatUserName(firstName?: string | null, lastName?: string | null): string {
  const first = firstName || '';
  const last = lastName || '';
  
  // Create name, avoiding duplicates and handling empty values
  let name = first;
  if (last && last !== first) {
    name = `${first} ${last}`;
  }
  
  return name.trim() || 'User'; // Fallback to 'User' if both are empty
}

// Test cases
console.log('🧪 Testing Name Formatting Logic...');

console.log('Test 1 - Same name:', formatUserName('anshi', 'anshi')); // Should return "anshi"
console.log('Test 2 - Different names:', formatUserName('John', 'Doe')); // Should return "John Doe"
console.log('Test 3 - Only first name:', formatUserName('Alice', '')); // Should return "Alice"
console.log('Test 4 - Only last name:', formatUserName('', 'Smith')); // Should return "User"
console.log('Test 5 - Both empty:', formatUserName('', '')); // Should return "User"
console.log('Test 6 - Null values:', formatUserName(null, null)); // Should return "User"
console.log('Test 7 - First name only with null last:', formatUserName('Bob', null)); // Should return "Bob"

console.log('✅ All tests completed!');