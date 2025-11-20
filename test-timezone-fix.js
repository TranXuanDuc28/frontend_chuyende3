// Test script to verify timezone conversion fix
const { toVietnamISOString, fromVietnamISOString } = require('./src/utils/timezone.js');

console.log('🧪 Testing timezone conversion fix...\n');

// Test case: User selects 22:42 (10:42 PM) in Vietnam timezone
const testTime = '2024-01-15T22:42'; // This is what datetime-local input returns

console.log('📝 Test Input:');
console.log(`   User selects: ${testTime} (22:42)`);
console.log(`   Expected: Should show 22:42 when displayed back\n`);

// Step 1: Convert to ISO string (what gets sent to backend)
const isoString = toVietnamISOString(testTime);
console.log('🔄 Step 1 - Frontend toVietnamISOString:');
console.log(`   Input: ${testTime}`);
console.log(`   Output: ${isoString}`);
console.log(`   Expected: UTC time representing 22:42 Vietnam time\n`);

// Step 2: Convert back from ISO string (what backend returns)
const backToLocal = fromVietnamISOString(isoString);
console.log('🔄 Step 2 - Frontend fromVietnamISOString:');
console.log(`   Input: ${isoString}`);
console.log(`   Output: ${backToLocal}`);
console.log(`   Expected: ${testTime} (should match original input)\n`);

// Check if round-trip works correctly
const isCorrect = backToLocal === testTime;
console.log('✅ Result:');
if (isCorrect) {
  console.log('   ✅ SUCCESS: Round-trip conversion works correctly!');
  console.log('   ✅ User will see the same time they selected');
} else {
  console.log('   ❌ FAILED: Round-trip conversion is incorrect');
  console.log(`   ❌ Expected: ${testTime}`);
  console.log(`   ❌ Got: ${backToLocal}`);
}

console.log('\n📊 Summary:');
console.log(`   Original input: ${testTime}`);
console.log(`   ISO string sent to backend: ${isoString}`);
console.log(`   Displayed back to user: ${backToLocal}`);
console.log(`   Round-trip correct: ${isCorrect ? 'Yes' : 'No'}`);

