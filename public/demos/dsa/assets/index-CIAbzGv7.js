(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`dsa_study_buddy_log`,t=100,n=class{static installed=!1;static buf(){try{return JSON.parse(sessionStorage.getItem(e)||`[]`)}catch{return[]}}static save(t){try{sessionStorage.setItem(e,JSON.stringify(t))}catch{}}static push(e,n,r){let i=this.buf();i.push({ts:new Date().toISOString(),type:e,msg:String(n).slice(0,2e3),...r?{where:r}:{}}),i.length>t&&i.splice(0,i.length-t),this.save(i)}static log(e,t=`error`){this.push(t,e)}static install(){if(!(this.installed||typeof window>`u`)){this.installed=!0,window.addEventListener(`error`,e=>{let t=e.target,n=e.error?.stack||e.message||`resource error: ${t?.src||t?.href||`unknown`}`;this.push(`error`,`[uncaught] ${n}`,e.filename?`${e.filename}:${e.lineno}:${e.colno}`:void 0)}),window.addEventListener(`unhandledrejection`,e=>{let t=e.reason;this.push(`error`,`[unhandledrejection] ${t?.stack||t?.message||(typeof t==`object`?i(t):String(t))}`)});for(let e of[`error`,`warn`]){let t=console[e].bind(console);console[e]=(...n)=>{try{this.push(e,n.map(r).join(` `))}catch{}t(...n)}}}}static getLogs(){return this.buf()}static clear(){this.save([])}static exportLogs(){let e=new Blob([JSON.stringify(this.buf(),null,2)],{type:`application/json`}),t=document.createElement(`a`);t.href=URL.createObjectURL(e),t.download=`dsa-study-buddy-errors-${Date.now()}.json`,t.style.display=`none`,document.body.appendChild(t),t.click(),setTimeout(()=>{document.body.removeChild(t),URL.revokeObjectURL(t.href)},1e3)}};function r(e){return e instanceof Error?e.stack||e.message:typeof e==`object`&&e?i(e):String(e)}function i(e){try{return JSON.stringify(e)}catch{return String(e)}}var a=new URL(`practice.worker-DHuS8GJt.js`,import.meta.url).href;function o(e,t,n){return new Promise(r=>{let i=new URL(a,import.meta.url).pathname,o=new Worker(`/api/dsa-runner?asset=${encodeURIComponent(i)}`),s,c=e=>{clearTimeout(d),clearTimeout(s),n.removeEventListener(`abort`,u),o.terminate(),r(e)},l=e=>c({allPassed:!1,results:[],compileError:e}),u=()=>l(`Run cancelled.`),d=setTimeout(()=>l(`The test runner could not load. Please try again.`),12e3);n.addEventListener(`abort`,u,{once:!0}),n.aborted?u():(o.onerror=()=>l(`The test runner encountered an error. Check your code and try again.`),o.onmessage=n=>{n.data.ready?(clearTimeout(d),s=setTimeout(()=>l(`Time limit exceeded (2.5 seconds). Check for an infinite loop.`),2500),o.postMessage({problemId:t,code:e})):c(n.data)})})}var s=e=>Array.isArray(e)?[...e].sort((e,t)=>Number(e)-Number(t)):e,c=e=>Array.isArray(e)?[...e].map(e=>Array.isArray(e)?[...e].sort():e).sort((e,t)=>JSON.stringify(e).localeCompare(JSON.stringify(t))):e,l={id:`arrays`,name:`Arrays`,subpatterns:[{id:`arr-prefix-sum`,name:`Prefix Sum`,explanation:`Precompute cumulative sums so any range sum becomes a subtraction instead of a re-scan. Often paired with a hash map to count subarrays matching a target sum in O(n).`,problems:[{id:`arr-subarray-sum-k`,title:`Subarray Sum Equals K`,difficulty:`Medium`,description:`Given an integer array nums and an integer k, return the number of contiguous subarrays whose sum equals k.

Classic prefix-sum technique: keep a running prefix sum and a hash map of how many times each prefix sum has occurred. For each index, check whether (prefixSum - k) has been seen before.`,fnName:`subarraySumEqualsK`,starterCode:`function subarraySumEqualsK(nums, k) {
  // your code here
}`,testCases:[{input:[[1,1,1],2],expected:2},{input:[[1,2,3],3],expected:2},{input:[[1,-1,0],0],expected:3},{input:[[3,4,7,2,-3,1,4,2],7],expected:4}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`int`,name:`k`}],returns:{kind:`int`}},solution:`function subarraySumEqualsK(nums, k) {
  const seen = new Map([[0, 1]]);
  let sum = 0, count = 0;
  for (const n of nums) {
    sum += n;
    count += seen.get(sum - k) || 0;
    seen.set(sum, (seen.get(sum) || 0) + 1);
  }
  return count;
}`,solutions:[{approach:`Prefix Sum + HashMap`,timeComplexity:`O(n)`,spaceComplexity:`O(n)`,explanation:`Track a running prefix sum and how many times each prefix sum value has occurred. A subarray ending at the current index sums to k exactly when (currentSum - k) was seen before, so each index is O(1) work.`,code:`function subarraySumEqualsK(nums, k) {
  const seen = new Map([[0, 1]]);
  let sum = 0, count = 0;
  for (const n of nums) {
    sum += n;
    count += seen.get(sum - k) || 0;
    seen.set(sum, (seen.get(sum) || 0) + 1);
  }
  return count;
}`},{approach:`Brute-force (all subarrays)`,timeComplexity:`O(n^2)`,spaceComplexity:`O(1)`,explanation:`Try every start index, extending the end index one step at a time and keeping a running sum. Correct, but re-derives every subarray sum from scratch instead of reusing prefix sums.`,code:`function subarraySumEqualsK(nums, k) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum === k) count++;
    }
  }
  return count;
}`}]}]},{id:`arr-sliding-window`,name:`Sliding Window`,explanation:`Maintain a window [left, right] over the array and slide it, adding/removing one element at a time instead of recomputing the window's aggregate from scratch. Turns O(n*k) into O(n).`,problems:[{id:`arr-max-sum-subarray-k`,title:`Maximum Sum Subarray of Size K`,difficulty:`Easy`,description:`Given an integer array nums and an integer k, find the maximum sum of any contiguous subarray of size k.

Sliding window: maintain a running sum for a window of size k, sliding it one element at a time instead of recomputing the sum from scratch.`,fnName:`maxSumSubarrayOfSizeK`,starterCode:`function maxSumSubarrayOfSizeK(nums, k) {
  // your code here
}`,testCases:[{input:[[2,1,5,1,3,2],3],expected:9},{input:[[2,3,4,1,5],2],expected:7},{input:[[1,1,1,1,1],1],expected:1},{input:[[4,2,1,6],4],expected:13}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`int`,name:`k`}],returns:{kind:`int`}},solution:`function maxSumSubarrayOfSizeK(nums, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let max = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    max = Math.max(max, windowSum);
  }
  return max;
}`,solutions:[{approach:`Sliding Window`,timeComplexity:`O(n)`,spaceComplexity:`O(1)`,explanation:`Compute the sum of the first window, then slide it one element at a time: add the entering element and subtract the leaving one instead of re-summing the whole window.`,code:`function maxSumSubarrayOfSizeK(nums, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let max = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    max = Math.max(max, windowSum);
  }
  return max;
}`},{approach:`Brute-force (recompute each window)`,timeComplexity:`O(n*k)`,spaceComplexity:`O(1)`,explanation:`Try every window start index and sum its k elements from scratch. Correct, but redoes work the sliding window reuses.`,code:`function maxSumSubarrayOfSizeK(nums, k) {
  let max = -Infinity;
  for (let i = 0; i + k <= nums.length; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) sum += nums[j];
    max = Math.max(max, sum);
  }
  return max;
}`}]}]},{id:`arr-kadane`,name:`Kadane's / Subarray`,explanation:`Track the best subarray sum ending at the current index; either extend the previous subarray or start fresh at the current element, whichever is larger.`,problems:[{id:`arr-max-subarray-sum`,title:`Maximum Subarray Sum (Kadane's Algorithm)`,difficulty:`Medium`,description:`Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum, and return that sum.`,fnName:`maxSubArraySum`,starterCode:`function maxSubArraySum(nums) {
  // your code here
}`,testCases:[{input:[[-2,1,-3,4,-1,2,1,-5,4]],expected:6},{input:[[5,4,-1,7,8]],expected:23},{input:[[-1]],expected:-1},{input:[[-2,-1]],expected:-1},{input:[[1,2,3,4]],expected:10}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`}],returns:{kind:`int`}},solution:`function maxSubArraySum(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,solutions:[{approach:`Kadane's Algorithm`,timeComplexity:`O(n)`,spaceComplexity:`O(1)`,explanation:`At each index, decide whether extending the previous subarray is still worth it or whether starting fresh at the current element beats it — track the running best either way. One pass, constant extra state.`,code:`function maxSubArraySum(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`},{approach:`Brute force — all subarrays`,timeComplexity:`O(n^2)`,spaceComplexity:`O(1)`,explanation:`Fix every start index and extend the end index one step at a time, tracking the running sum and the best seen. Correct and simple, but redoes work Kadane's avoids by never reusing a previous partial sum.`,code:`function maxSubArraySum(nums) {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      best = Math.max(best, sum);
    }
  }
  return best;
}`}]}]},{id:`arr-binary-search`,name:`Binary Search`,explanation:`Repeatedly halve a sorted search space by comparing the midpoint to the target, discarding the half that can't contain the answer.`,problems:[{id:`arr-classic-binary-search`,title:`Binary Search`,difficulty:`Easy`,description:`Given a sorted array of distinct integers nums and a target value, return the index of target in nums, or -1 if it is not present.`,fnName:`binarySearch`,starterCode:`function binarySearch(nums, target) {
  // your code here
}`,testCases:[{input:[[-1,0,3,5,9,12],9],expected:4},{input:[[-1,0,3,5,9,12],2],expected:-1},{input:[[5],5],expected:0},{input:[[],3],expected:-1},{input:[[1,3,5,7,9,11],1],expected:0}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`int`,name:`target`}],returns:{kind:`int`}},solution:`function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}`,solutions:[{approach:`Binary Search`,timeComplexity:`O(log n)`,spaceComplexity:`O(1)`,explanation:`Repeatedly compare the midpoint to the target and discard the half of the search space that can't contain it. Works because the array is sorted — every comparison halves the remaining candidates.`,code:`function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}`},{approach:`Linear Scan`,timeComplexity:`O(n)`,spaceComplexity:`O(1)`,explanation:`Check every element left to right until the target is found. Correct for any array, sorted or not — but ignores the sortedness that binary search exploits to skip most of the array.`,code:`function binarySearch(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}`}]}]}]},u={id:`string`,name:`String`,subpatterns:[{id:`str-two-pointers`,name:`Two Pointers`,explanation:`Walk two indices through a string (often from opposite ends, sometimes both forward) to compare or rearrange characters in a single pass instead of nested loops.`,problems:[{id:`str-is-subsequence`,title:`Is Subsequence`,difficulty:`Easy`,description:`Given two strings s and t, return true if s is a subsequence of t (i.e. s can be formed by deleting some characters from t, without changing the order of the remaining characters), or false otherwise.`,fnName:`isSubsequence`,starterCode:`function isSubsequence(s, t) {
  // your code here
}`,testCases:[{input:[`abc`,`ahbgdc`],expected:!0},{input:[`axc`,`ahbgdc`],expected:!1},{input:[``,`ahbgdc`],expected:!0},{input:[`abc`,`abc`],expected:!0},{input:[`abc`,`ab`],expected:!1}],cSignature:{params:[{kind:`string`,name:`s`},{kind:`string`,name:`t`}],returns:{kind:`bool`}},solution:`function isSubsequence(s, t) {
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) {
    if (s[i] === t[j]) i++;
  }
  return i === s.length;
}`,solutions:[{approach:`Two Pointers`,timeComplexity:`O(n)`,spaceComplexity:`O(1)`,explanation:`Walk t with one pointer, only advancing the pointer into s when the current characters match. If the s-pointer reaches the end, every character of s was found in order somewhere in t.`,code:`function isSubsequence(s, t) {
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) {
    if (s[i] === t[j]) i++;
  }
  return i === s.length;
}`},{approach:`Recursive match-or-skip`,timeComplexity:`O(2^m) worst case (m = t.length) — branches at every matching character`,spaceComplexity:`O(m) recursion depth`,explanation:`At each position, either consume a matching character or skip ahead in t, trying both when they match. Explores redundant branches the two-pointer scan sidesteps by always taking a match greedily.`,code:`function isSubsequence(s, t) {
  function helper(i, j) {
    if (i === s.length) return true;
    if (j === t.length) return false;
    if (s[i] === t[j] && helper(i + 1, j + 1)) return true;
    return helper(i, j + 1);
  }
  return helper(0, 0);
}`}]}]},{id:`str-pattern-matching`,name:`Pattern Matching / KMP`,explanation:`Find occurrences of a pattern inside text in O(n+m) by precomputing a failure function that avoids re-scanning already-matched characters after a mismatch.`,problems:[{id:`str-needle-in-haystack`,title:`Find the Index of the First Occurrence in a String`,difficulty:`Medium`,description:`Given two strings haystack and needle, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.`,fnName:`strStr`,starterCode:`function strStr(haystack, needle) {
  // your code here
}`,testCases:[{input:[`sadbutsad`,`sad`],expected:0},{input:[`leetcode`,`leeto`],expected:-1},{input:[`hello`,``],expected:0},{input:[`aaaaa`,`bba`],expected:-1},{input:[`mississippi`,`issip`],expected:4}],cSignature:{params:[{kind:`string`,name:`haystack`},{kind:`string`,name:`needle`}],returns:{kind:`int`}},solution:`function strStr(haystack, needle) {
  const n = haystack.length, m = needle.length;
  if (m === 0) return 0;
  const lps = new Array(m).fill(0);
  let len = 0, i = 1;
  while (i < m) {
    if (needle[i] === needle[len]) { len++; lps[i] = len; i++; }
    else if (len !== 0) { len = lps[len - 1]; }
    else { lps[i] = 0; i++; }
  }
  let hi = 0, ni = 0;
  while (hi < n) {
    if (haystack[hi] === needle[ni]) { hi++; ni++; if (ni === m) return hi - ni; }
    else if (ni !== 0) { ni = lps[ni - 1]; }
    else { hi++; }
  }
  return -1;
}`,solutions:[{approach:`KMP (failure function)`,timeComplexity:`O(n + m)`,spaceComplexity:`O(m)`,explanation:`Precompute, for every prefix of needle, the length of the longest proper prefix that's also a suffix (the 'lps' table). On a mismatch, that table tells the pattern pointer exactly how far to fall back without ever re-reading a haystack character — linear total work regardless of how repetitive the pattern is.`,code:`function strStr(haystack, needle) {
  const n = haystack.length, m = needle.length;
  if (m === 0) return 0;
  const lps = new Array(m).fill(0);
  let len = 0, i = 1;
  while (i < m) {
    if (needle[i] === needle[len]) { len++; lps[i] = len; i++; }
    else if (len !== 0) { len = lps[len - 1]; }
    else { lps[i] = 0; i++; }
  }
  let hi = 0, ni = 0;
  while (hi < n) {
    if (haystack[hi] === needle[ni]) { hi++; ni++; if (ni === m) return hi - ni; }
    else if (ni !== 0) { ni = lps[ni - 1]; }
    else { hi++; }
  }
  return -1;
}`},{approach:`Brute force sliding compare`,timeComplexity:`O(n * m)`,spaceComplexity:`O(1)`,explanation:`Try every start position in haystack and compare character-by-character against needle. Simple, but a mismatch discards no information — the next attempt restarts the pattern from scratch, which is what KMP's failure function exists to avoid.`,code:`function strStr(haystack, needle) {
  const n = haystack.length, m = needle.length;
  if (m === 0) return 0;
  for (let i = 0; i + m <= n; i++) {
    let j = 0;
    while (j < m && haystack[i + j] === needle[j]) j++;
    if (j === m) return i;
  }
  return -1;
}`}]}]},{id:`str-anagram-frequency`,name:`Anagram / Frequency Count`,explanation:`Compare character frequency counts (via a map or a fixed-size array for lowercase letters) rather than sorting, to check anagram-ness or count distinct character sets in O(n).`,problems:[{id:`str-valid-anagram`,title:`Valid Anagram`,difficulty:`Easy`,description:`Given two strings s and t, return true if t is an anagram of s (same letters, same counts, any order).

Build a frequency map of one string's characters, then walk the other string decrementing counts.`,fnName:`isAnagram`,starterCode:`function isAnagram(s, t) {
  // your code here
}`,testCases:[{input:[`anagram`,`nagaram`],expected:!0},{input:[`rat`,`car`],expected:!1},{input:[`a`,`a`],expected:!0},{input:[`ab`,`a`],expected:!1}],cSignature:{params:[{kind:`string`,name:`s`},{kind:`string`,name:`t`}],returns:{kind:`bool`}},solution:`function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = {};
  for (const c of s) counts[c] = (counts[c] || 0) + 1;
  for (const c of t) {
    if (!counts[c]) return false;
    counts[c]--;
  }
  return true;
}`,solutions:[{approach:`Frequency Map`,timeComplexity:`O(n)`,spaceComplexity:`O(1)`,explanation:`Count each character of s into a map, then decrement while walking t. Space is O(1) since the alphabet is fixed-size regardless of string length.`,code:`function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = {};
  for (const c of s) counts[c] = (counts[c] || 0) + 1;
  for (const c of t) {
    if (!counts[c]) return false;
    counts[c]--;
  }
  return true;
}`},{approach:`Sort + Compare`,timeComplexity:`O(n log n)`,spaceComplexity:`O(n)`,explanation:`Sort both strings' characters and compare the results directly. Simple to reason about, but the sort is asymptotically worse than counting.`,code:`function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const sort = (str) => str.split('').sort().join('');
  return sort(s) === sort(t);
}`}]}]},{id:`str-palindrome`,name:`Palindrome`,explanation:`A string reads the same forwards and backwards. Check with two pointers closing inward, or build up palindromic substrings with expand-around-center / DP for harder variants.`,problems:[{id:`str-valid-palindrome`,title:`Valid Palindrome`,difficulty:`Easy`,description:`Given a string s, return true if it is a palindrome after converting to lowercase and removing all non-alphanumeric characters.

Two-pointer technique isn't strictly required here but is the natural fit: walk from both ends inward, skipping non-alphanumeric characters, and compare.`,fnName:`isPalindrome`,starterCode:`function isPalindrome(s) {
  // your code here
}`,testCases:[{input:[`A man, a plan, a canal: Panama`],expected:!0},{input:[`race a car`],expected:!1},{input:[``],expected:!0},{input:[`0P`],expected:!1}],cSignature:{params:[{kind:`string`,name:`s`}],returns:{kind:`bool`}},solution:`function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let i = 0, j = clean.length - 1;
  while (i < j) {
    if (clean[i] !== clean[j]) return false;
    i++; j--;
  }
  return true;
}`,solutions:[{approach:`Two Pointers`,timeComplexity:`O(n)`,spaceComplexity:`O(n)`,explanation:`Clean the string once, then walk pointers inward from both ends, comparing and stopping at the first mismatch. No extra pass needed once the string is cleaned.`,code:`function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let i = 0, j = clean.length - 1;
  while (i < j) {
    if (clean[i] !== clean[j]) return false;
    i++; j--;
  }
  return true;
}`},{approach:`Recursive Slice-and-Compare`,timeComplexity:`O(n^2)`,spaceComplexity:`O(n)`,explanation:`Clean the string, then recursively compare its outer characters and recurse on the substring with both ends trimmed off. Each level slices a new string (an O(n) copy), so total work is quadratic even though the recursion is only n levels deep.`,code:`function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  function check(str) {
    if (str.length <= 1) return true;
    if (str[0] !== str[str.length - 1]) return false;
    return check(str.slice(1, -1));
  }
  return check(clean);
}`}]}]}]},d={id:`hashing`,name:`Hashing`,subpatterns:[{id:`hash-hash-map`,name:`Hash Map`,explanation:`A hash map gives O(1) average lookup/insert, turning many O(n^2) brute-force pair/lookup problems into O(n) by trading space for time.`,problems:[{id:`hash-design-hashmap`,title:`Design HashMap`,difficulty:`Easy`,description:`Design a HashMap without using any built-in hash table library, exercised via a sequence of operations. ops[i] is one of "put", "get", "remove"; argsList[i] holds that operation's arguments. put/remove return null; get returns the value, or -1 if the key is absent.`,fnName:`hashMapOperations`,starterCode:`function hashMapOperations(ops, argsList) {
  // your code here
}`,testCases:[{input:[[`put`,`put`,`get`,`get`,`put`,`get`,`remove`,`get`],[[1,1],[2,2],[1],[3],[2,1],[2],[2],[2]]],expected:[null,null,1,-1,null,1,null,-1]},{input:[[`get`,`put`,`get`],[[`a`],[`a`,5],[`a`]]],expected:[-1,null,5]}],solution:`function hashMapOperations(ops, argsList) {
  const map = new Map();
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'put') { map.set(a[0], a[1]); out.push(null); }
    else if (op === 'get') { out.push(map.has(a[0]) ? map.get(a[0]) : -1); }
    else { map.delete(a[0]); out.push(null); }
  }
  return out;
}`,solutions:[{approach:`Native Hash Map`,timeComplexity:`O(1) average per operation`,spaceComplexity:`O(n)`,explanation:`A real hash table hashes the key to a bucket, giving average constant-time put/get/remove regardless of how many keys are stored.`,code:`function hashMapOperations(ops, argsList) {
  const map = new Map();
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'put') { map.set(a[0], a[1]); out.push(null); }
    else if (op === 'get') { out.push(map.has(a[0]) ? map.get(a[0]) : -1); }
    else { map.delete(a[0]); out.push(null); }
  }
  return out;
}`},{approach:`Array of [key, value] pairs`,timeComplexity:`O(n) per operation`,spaceComplexity:`O(n)`,explanation:`Store entries as a flat list and linearly scan for the key on every operation. Illustrates exactly the cost a hash table's bucketing avoids — every put/get/remove rescans everything stored so far.`,code:`function hashMapOperations(ops, argsList) {
  const store = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    const idx = store.findIndex((p) => p[0] === a[0]);
    if (op === 'put') {
      if (idx >= 0) store[idx][1] = a[1]; else store.push([a[0], a[1]]);
      out.push(null);
    } else if (op === 'get') {
      out.push(idx >= 0 ? store[idx][1] : -1);
    } else {
      if (idx >= 0) store.splice(idx, 1);
      out.push(null);
    }
  }
  return out;
}`}]}]},{id:`hash-frequency-map`,name:`Frequency Map`,explanation:`Count occurrences of each element into a map (or array for small fixed alphabets) to answer questions about counts, duplicates, or majority elements in one pass.`,problems:[{id:`hash-first-unique-char`,title:`First Unique Character in a String`,difficulty:`Easy`,description:`Given a string s, return the index of the first non-repeating character, or -1 if none exists.`,fnName:`firstUniqChar`,starterCode:`function firstUniqChar(s) {
  // your code here
}`,testCases:[{input:[`leetcode`],expected:0},{input:[`loveleetcode`],expected:2},{input:[`aabb`],expected:-1},{input:[`z`],expected:0},{input:[``],expected:-1}],solution:`function firstUniqChar(s) {
  const counts = new Map();
  for (const c of s) counts.set(c, (counts.get(c) || 0) + 1);
  for (let i = 0; i < s.length; i++) if (counts.get(s[i]) === 1) return i;
  return -1;
}`,solutions:[{approach:`Frequency Map, two passes`,timeComplexity:`O(n)`,spaceComplexity:`O(1) — at most 26/alphabet-size distinct keys`,explanation:`First pass builds a count of every character; second pass returns the first index whose count is exactly 1. Each pass is linear and independent of how many characters repeat.`,code:`function firstUniqChar(s) {
  const counts = new Map();
  for (const c of s) counts.set(c, (counts.get(c) || 0) + 1);
  for (let i = 0; i < s.length; i++) if (counts.get(s[i]) === 1) return i;
  return -1;
}`},{approach:`Brute force — count via rescanning`,timeComplexity:`O(n^2)`,spaceComplexity:`O(1)`,explanation:`For each character, rescan the entire string to count its occurrences. Correct, but redoes the same counting work from scratch at every index instead of computing all counts once.`,code:`function firstUniqChar(s) {
  for (let i = 0; i < s.length; i++) {
    let count = 0;
    for (let j = 0; j < s.length; j++) if (s[j] === s[i]) count++;
    if (count === 1) return i;
  }
  return -1;
}`}]}]},{id:`hash-count-distinct`,name:`Count Distinct`,explanation:`A hash set tracks which elements have already been seen, letting you count or filter distinct values in O(n) instead of sorting first.`,problems:[{id:`hash-count-distinct-in-window`,title:`Count Distinct Elements in Every Window of Size K`,difficulty:`Medium`,description:`Given an array nums and a window size k, return an array where entry i is the number of distinct elements in the window of size k ending at index i (one entry per valid window, in order).`,fnName:`countDistinctWindows`,starterCode:`function countDistinctWindows(nums, k) {
  // your code here
}`,testCases:[{input:[[1,2,1,3,4,2,3],4],expected:[3,4,4,3]},{input:[[1,1,1,1],2],expected:[1,1,1]},{input:[[1,2,3,4],1],expected:[1,1,1,1]},{input:[[1,2,1,2,1],3],expected:[2,2,2]}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`int`,name:`k`}],returns:{kind:`intArray`}},solution:`function countDistinctWindows(nums, k) {
  const freq = new Map();
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1);
    if (i >= k) {
      const out = nums[i - k];
      freq.set(out, freq.get(out) - 1);
      if (freq.get(out) === 0) freq.delete(out);
    }
    if (i >= k - 1) res.push(freq.size);
  }
  return res;
}`,solutions:[{approach:`Sliding window + frequency map`,timeComplexity:`O(n)`,spaceComplexity:`O(k)`,explanation:`Maintain a running frequency map as the window slides: add the entering element, remove the leaving element (deleting its key once its count hits zero so map.size always reflects the true distinct count), and read off map.size at each valid window.`,code:`function countDistinctWindows(nums, k) {
  const freq = new Map();
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1);
    if (i >= k) {
      const out = nums[i - k];
      freq.set(out, freq.get(out) - 1);
      if (freq.get(out) === 0) freq.delete(out);
    }
    if (i >= k - 1) res.push(freq.size);
  }
  return res;
}`},{approach:`Brute force — new Set per window`,timeComplexity:`O(n * k)`,spaceComplexity:`O(k)`,explanation:`For every window start, build a fresh Set from that slice and read its size. Correct, but throws away and rebuilds the whole window's distinct-count state on every slide instead of updating incrementally.`,code:`function countDistinctWindows(nums, k) {
  const res = [];
  for (let i = 0; i + k <= nums.length; i++) {
    res.push(new Set(nums.slice(i, i + k)).size);
  }
  return res;
}`}]}]},{id:`hash-group-anagrams`,name:`Group Anagrams`,explanation:`Bucket strings by a canonical signature (sorted characters, or a letter-count signature) so anagrams land in the same bucket without pairwise comparison.`,problems:[{id:`hash-group-anagrams`,title:`Group Anagrams`,difficulty:`Medium`,description:`Given an array of strings, group the anagrams together. Return the groups in any order; the strings within a group may also be in any order.

Use a hash map keyed by each string's sorted-character signature (or a letter-count signature); strings with the same signature belong to the same group.`,fnName:`groupAnagrams`,starterCode:`function groupAnagrams(strs) {
  // your code here, return string[][]
}`,testCases:[{input:[[`eat`,`tea`,`tan`,`ate`,`nat`,`bat`]],expected:[[`bat`],[`nat`,`tan`],[`ate`,`eat`,`tea`]]},{input:[[``]],expected:[[``]]},{input:[[`a`]],expected:[[`a`]]}],solution:`function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}`,solutions:[{approach:`Sorted-Key HashMap`,timeComplexity:`O(n * k log k)`,spaceComplexity:`O(n * k)`,explanation:`Bucket each string under its sorted-character signature (k = string length); anagrams share the same signature. Simple, but sorting each string costs an extra log k factor.`,code:`function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}`},{approach:`Character-Count Signature`,timeComplexity:`O(n * k)`,spaceComplexity:`O(n * k)`,explanation:`Build each string's signature from a 26-length lowercase letter count instead of sorting, dropping the log k factor since counting is linear in the string's length.`,code:`function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const counts = new Array(26).fill(0);
    for (const c of s) counts[c.charCodeAt(0) - 97]++;
    const key = counts.join(',');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}`}],normalize:c}]},{id:`hash-two-sum`,name:`Two Sum`,explanation:`The canonical 'have I seen the complement' hash map pattern: check for target - current before inserting current, so the whole array is scanned once.`,problems:[{id:`hash-two-sum`,title:`Two Sum`,difficulty:`Easy`,description:`Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Assume exactly one solution exists and you may not use the same element twice.

One-pass hash map: for each number, check whether its complement (target - num) has already been seen; if so, return the stored index and the current index.`,fnName:`twoSum`,starterCode:`function twoSum(nums, target) {
  // your code here, return [i, j]
}`,testCases:[{input:[[2,7,11,15],9],expected:[0,1]},{input:[[3,2,4],6],expected:[1,2]},{input:[[3,3],6],expected:[0,1]},{input:[[-1,-2,-3,-4,-5],-8],expected:[2,4]}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`int`,name:`target`}],returns:{kind:`intArray`}},solution:`function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  return [];
}`,solutions:[{approach:`One-pass HashMap`,timeComplexity:`O(n)`,spaceComplexity:`O(n)`,explanation:`For each number, check whether its complement was already seen before inserting the current number. The whole array is scanned exactly once.`,code:`function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  return [];
}`},{approach:`Brute-force (all pairs)`,timeComplexity:`O(n^2)`,spaceComplexity:`O(1)`,explanation:`Check every pair of indices for a sum match. No extra space, but quadratic time.`,code:`function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`}],normalize:s}]}]},f={id:`stack`,name:`Stack`,subpatterns:[{id:`stack-monotonic`,name:`Monotonic Stack`,explanation:`Keep the stack's elements strictly increasing or decreasing by popping before every push. Popped elements have just found their 'next greater/smaller' neighbor.`,problems:[{id:`stack-daily-temperatures`,title:`Daily Temperatures`,difficulty:`Medium`,description:`Given an array of daily temperatures, return an array answer where answer[i] is the number of days you have to wait after day i to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0.`,fnName:`dailyTemperatures`,starterCode:`function dailyTemperatures(temperatures) {
  // your code here
}`,testCases:[{input:[[73,74,75,71,69,72,76,73]],expected:[1,1,4,2,1,1,0,0]},{input:[[30,40,50,60]],expected:[1,1,1,0]},{input:[[30,60,90]],expected:[1,1,0]},{input:[[90,60,30]],expected:[0,0,0]}],cSignature:{params:[{kind:`intArray`,name:`temperatures`,sizeName:`temperaturesSize`}],returns:{kind:`intArray`}},solution:`function dailyTemperatures(temperatures) {
  const res = new Array(temperatures.length).fill(0);
  const stack = [];
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const j = stack.pop();
      res[j] = i - j;
    }
    stack.push(i);
  }
  return res;
}`,solutions:[{approach:`Monotonic (decreasing) Stack`,timeComplexity:`O(n)`,spaceComplexity:`O(n)`,explanation:`Keep indices on the stack whose warmer day hasn't been found yet, temperatures decreasing bottom-to-top. Each index is pushed once and popped at most once — the moment a warmer day appears, it resolves every colder day still waiting on the stack in one shot.`,code:`function dailyTemperatures(temperatures) {
  const res = new Array(temperatures.length).fill(0);
  const stack = [];
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const j = stack.pop();
      res[j] = i - j;
    }
    stack.push(i);
  }
  return res;
}`},{approach:`Brute-force (scan right for each day)`,timeComplexity:`O(n^2)`,spaceComplexity:`O(1)`,explanation:`For each day, scan forward day by day until a warmer one turns up. Correct, but on a strictly falling temperature run every scan walks all the way to the end for no answer.`,code:`function dailyTemperatures(temperatures) {
  const res = new Array(temperatures.length).fill(0);
  for (let i = 0; i < temperatures.length; i++) {
    for (let j = i + 1; j < temperatures.length; j++) {
      if (temperatures[j] > temperatures[i]) { res[i] = j - i; break; }
    }
  }
  return res;
}`}]}]},{id:`stack-balanced-parens`,name:`Balanced Parentheses`,explanation:`Push opening brackets; on a closing bracket, pop and verify it's the matching type. Balanced iff the stack is empty at the end.`,problems:[{id:`stack-valid-parentheses`,title:`Valid Parentheses`,difficulty:`Easy`,description:`Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input is valid: every open bracket is closed by the same type of bracket, in the correct order.

Push open brackets onto a stack; on a closing bracket, pop and check it matches. Valid iff the stack ends empty.`,fnName:`isValidParens`,starterCode:`function isValidParens(s) {
  // your code here
}`,testCases:[{input:[`()`],expected:!0},{input:[`()[]{}`],expected:!0},{input:[`(]`],expected:!1},{input:[`([)]`],expected:!1},{input:[`{[]}`],expected:!0}],solution:`function isValidParens(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') {
      stack.push(c);
    } else {
      if (stack.pop() !== pairs[c]) return false;
    }
  }
  return stack.length === 0;
}`,solutions:[{approach:`Stack`,timeComplexity:`O(n)`,spaceComplexity:`O(n)`,explanation:`Push every opening bracket. On a closing bracket, pop and check it matches the expected opener. Valid iff the stack is empty once the string is fully consumed.`,code:`function isValidParens(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') {
      stack.push(c);
    } else {
      if (stack.pop() !== pairs[c]) return false;
    }
  }
  return stack.length === 0;
}`},{approach:`Iterative Pair Removal`,timeComplexity:`O(n^2)`,spaceComplexity:`O(n)`,explanation:`Repeatedly strip innermost matched pairs ('()', '[]', '{}') until nothing changes. Valid iff the string is empty at the end. Each pass is O(n) and up to O(n) passes may be needed, so it's quadratic in the worst case, but it avoids reasoning about an explicit stack.`,code:`function isValidParens(s) {
  let prev;
  do {
    prev = s;
    s = s.replace('()', '').replace('[]', '').replace('{}', '');
  } while (s !== prev);
  return s.length === 0;
}`}]}]},{id:`stack-next-greater-smaller`,name:`Next Greater / Smaller`,explanation:`For each element, find the nearest element to its right (or left) that is greater/smaller, using a monotonic stack to avoid an O(n^2) scan.`,problems:[{id:`stack-next-greater-elements`,title:`Next Greater Element`,difficulty:`Medium`,description:`Given an array of integers, return an array where each element is replaced by the next element to its right that is strictly greater; use -1 if there is none.

Monotonic stack: walk the array keeping a decreasing stack of indices. When the current element is greater than the index on top of the stack, it's that index's 'next greater' — pop and record it.`,fnName:`nextGreaterElements`,starterCode:`function nextGreaterElements(nums) {
  // your code here
}`,testCases:[{input:[[2,1,2,4,3]],expected:[4,2,4,-1,-1]},{input:[[1,2,3,4]],expected:[2,3,4,-1]},{input:[[4,3,2,1]],expected:[-1,-1,-1,-1]}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`}],returns:{kind:`intArray`}},solution:`function nextGreaterElements(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`,solutions:[{approach:`Monotonic Stack`,timeComplexity:`O(n)`,spaceComplexity:`O(n)`,explanation:`Keep a stack of indices whose 'next greater' hasn't been found yet, decreasing top-to-bottom in value. Each index is pushed once and popped at most once, so the total work across the whole array is linear.`,code:`function nextGreaterElements(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`},{approach:`Brute-force (scan right for each element)`,timeComplexity:`O(n^2)`,spaceComplexity:`O(1)`,explanation:`For each index, scan rightward until a strictly greater element is found. Correct and easy to reason about, but re-scans the array from every starting index.`,code:`function nextGreaterElements(nums) {
  const result = new Array(nums.length).fill(-1);
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] > nums[i]) {
        result[i] = nums[j];
        break;
      }
    }
  }
  return result;
}`}]}]},{id:`stack-min-stack`,name:`Min Stack`,explanation:`Augment a stack so it can report its current minimum in O(1), typically by pushing (value, currentMin) pairs or maintaining a parallel min-stack.`,problems:[{id:`stack-min-stack-design`,title:`Min Stack`,difficulty:`Medium`,description:`Design a stack that supports push, pop, top, and retrieving the minimum element, all in O(1), exercised via a sequence of operations. ops[i] is one of "push", "pop", "top", "getMin"; argsList[i] holds that operation's arguments (empty for pop/top/getMin). push/pop return null.`,fnName:`minStackOperations`,starterCode:`function minStackOperations(ops, argsList) {
  // your code here
}`,testCases:[{input:[[`push`,`push`,`push`,`getMin`,`pop`,`top`,`getMin`],[[-2],[0],[-3],[],[],[],[]]],expected:[null,null,null,-3,null,0,-2]},{input:[[`push`,`push`,`getMin`,`pop`,`getMin`],[[5],[1],[],[],[]]],expected:[null,null,1,null,5]}],solution:`function minStackOperations(ops, argsList) {
  const stack = [];
  const minStack = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'push') {
      stack.push(a[0]);
      minStack.push(minStack.length === 0 ? a[0] : Math.min(minStack[minStack.length - 1], a[0]));
      out.push(null);
    } else if (op === 'pop') { stack.pop(); minStack.pop(); out.push(null); }
    else if (op === 'top') { out.push(stack[stack.length - 1]); }
    else { out.push(minStack[minStack.length - 1]); }
  }
  return out;
}`,solutions:[{approach:`Parallel min-stack`,timeComplexity:`O(1) per operation`,spaceComplexity:`O(n)`,explanation:`Alongside the value stack, maintain a second stack where each slot holds the minimum seen up to that depth. Pushing/popping both stacks together keeps getMin a plain top-of-stack read, never a rescan.`,code:`function minStackOperations(ops, argsList) {
  const stack = [];
  const minStack = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'push') {
      stack.push(a[0]);
      minStack.push(minStack.length === 0 ? a[0] : Math.min(minStack[minStack.length - 1], a[0]));
      out.push(null);
    } else if (op === 'pop') { stack.pop(); minStack.pop(); out.push(null); }
    else if (op === 'top') { out.push(stack[stack.length - 1]); }
    else { out.push(minStack[minStack.length - 1]); }
  }
  return out;
}`},{approach:`Brute force — Math.min over the stack on every getMin`,timeComplexity:`O(1) push/pop/top, O(n) getMin`,spaceComplexity:`O(n)`,explanation:`Use a single plain stack and rescan the whole thing whenever getMin is called. Simpler to write, but getMin degrades to linear time — exactly the cost the parallel min-stack is designed to avoid.`,code:`function minStackOperations(ops, argsList) {
  const stack = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'push') { stack.push(a[0]); out.push(null); }
    else if (op === 'pop') { stack.pop(); out.push(null); }
    else if (op === 'top') { out.push(stack[stack.length - 1]); }
    else { out.push(Math.min(...stack)); }
  }
  return out;
}`}]}]}]},ee={id:`system-design`,name:`System Design Building Blocks`,subpatterns:[{id:`sysdes-caching`,name:`Caching & Eviction`,explanation:`Bounded-size stores that must decide what to evict when full. See the 'Caching' term in the System Design glossary (#/concepts).`,problems:[{id:`sysdes-lru-cache`,title:`LRU Cache (Caching)`,difficulty:`Medium`,description:`Codes the 'Caching' glossary term. Given a capacity and a sequence of put(key, value)/get(key) operations, return one result per operation: null for put, the value (or -1 if absent) for get. When a put would exceed capacity, evict the Least Recently Used key first. Both get and put count as 'using' a key.

ops[i] is either "put" or "get"; argsList[i] holds that operation's arguments.`,fnName:`lruCacheOperations`,starterCode:`function lruCacheOperations(capacity, ops, argsList) {
  // your code here
}`,testCases:[{input:[2,[`put`,`put`,`get`,`put`,`get`,`put`,`get`,`get`,`get`],[[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]],expected:[null,null,1,null,-1,null,-1,3,4]},{input:[1,[`put`,`get`,`put`,`get`,`get`],[[2,1],[2],[3,2],[2],[3]]],expected:[null,1,null,-1,2]}],solution:`function lruCacheOperations(capacity, ops, argsList) {
  const map = new Map();
  const head = { key: null, value: null, prev: null, next: null };
  const tail = { key: null, value: null, prev: null, next: null };
  head.next = tail; tail.prev = head;
  function remove(node) { node.prev.next = node.next; node.next.prev = node.prev; }
  function addFront(node) { node.next = head.next; node.prev = head; head.next.prev = node; head.next = node; }
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], args = argsList[i];
    if (op === 'put') {
      const [key, value] = args;
      if (map.has(key)) {
        const node = map.get(key);
        node.value = value; remove(node); addFront(node);
      } else {
        if (map.size >= capacity) { const lru = tail.prev; remove(lru); map.delete(lru.key); }
        const node = { key, value, prev: null, next: null };
        addFront(node); map.set(key, node);
      }
      results.push(null);
    } else {
      const [key] = args;
      if (!map.has(key)) { results.push(-1); }
      else { const node = map.get(key); remove(node); addFront(node); results.push(node.value); }
    }
  }
  return results;
}`,solutions:[{approach:`HashMap + Doubly Linked List`,timeComplexity:`O(1) per operation`,spaceComplexity:`O(capacity)`,explanation:`The HashMap gives O(1) lookup by key; the doubly linked list gives O(1) move-to-front and O(1) eviction from the tail, since removing/inserting a known node needs no traversal. This is the standard real-world implementation (e.g. what a Redis-style in-process cache does).`,code:`function lruCacheOperations(capacity, ops, argsList) {
  const map = new Map();
  const head = { key: null, value: null, prev: null, next: null };
  const tail = { key: null, value: null, prev: null, next: null };
  head.next = tail; tail.prev = head;
  function remove(node) { node.prev.next = node.next; node.next.prev = node.prev; }
  function addFront(node) { node.next = head.next; node.prev = head; head.next.prev = node; head.next = node; }
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], args = argsList[i];
    if (op === 'put') {
      const [key, value] = args;
      if (map.has(key)) {
        const node = map.get(key);
        node.value = value; remove(node); addFront(node);
      } else {
        if (map.size >= capacity) { const lru = tail.prev; remove(lru); map.delete(lru.key); }
        const node = { key, value, prev: null, next: null };
        addFront(node); map.set(key, node);
      }
      results.push(null);
    } else {
      const [key] = args;
      if (!map.has(key)) { results.push(-1); }
      else { const node = map.get(key); remove(node); addFront(node); results.push(node.value); }
    }
  }
  return results;
}`},{approach:`Brute-force array (linear scan + splice)`,timeComplexity:`O(n) per operation`,spaceComplexity:`O(n)`,explanation:`Keep a plain array ordered most-recently-used first. Every get/put has to scan for the key (O(n)) and splice it to the front (O(n)). Correct, but each operation degrades linearly as the cache fills.`,code:`function lruCacheOperations(capacity, ops, argsList) {
  let arr = [];
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], args = argsList[i];
    if (op === 'put') {
      const [key, value] = args;
      const idx = arr.findIndex(([k]) => k === key);
      if (idx !== -1) arr.splice(idx, 1);
      arr.unshift([key, value]);
      if (arr.length > capacity) arr.pop();
      results.push(null);
    } else {
      const [key] = args;
      const idx = arr.findIndex(([k]) => k === key);
      if (idx === -1) { results.push(-1); }
      else { const [, value] = arr[idx]; arr.splice(idx, 1); arr.unshift([key, value]); results.push(value); }
    }
  }
  return results;
}`}]},{id:`sysdes-lfu-cache`,title:`LFU Cache (Caching)`,difficulty:`Medium`,description:`A stricter sibling of LRU under the 'Caching' glossary term: evict the Least Frequently Used key instead of the least recently used one. Ties (equal frequency) break by evicting whichever of the tied keys was touched least recently. Given a capacity and a sequence of put(key, value)/get(key) operations, return one result per operation: null for put, the value (or -1 if absent) for get. Both get and a put on an existing key count as 'using' that key and bump its frequency by 1.

ops[i] is either "put" or "get"; argsList[i] holds that operation's arguments.`,fnName:`lfuCacheOperations`,starterCode:`function lfuCacheOperations(capacity, ops, argsList) {
  // your code here
}`,testCases:[{input:[2,[`put`,`put`,`get`,`put`,`get`,`get`,`put`,`get`,`get`,`get`],[[1,1],[2,2],[1],[3,3],[2],[3],[4,4],[1],[3],[4]]],expected:[null,null,1,null,-1,3,null,-1,3,4]},{input:[0,[`put`,`get`],[[0,0],[0]]],expected:[null,-1]}],solution:`function lfuCacheOperations(capacity, ops, argsList) {
  const vals = new Map();
  const freqs = new Map();
  const freqGroups = new Map();
  let minFreq = 0;
  function touch(key) {
    const f = freqs.get(key);
    freqGroups.get(f).delete(key);
    if (freqGroups.get(f).size === 0) {
      freqGroups.delete(f);
      if (minFreq === f) minFreq = f + 1;
    }
    freqs.set(key, f + 1);
    if (!freqGroups.has(f + 1)) freqGroups.set(f + 1, new Set());
    freqGroups.get(f + 1).add(key);
  }
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], args = argsList[i];
    if (op === 'put') {
      if (capacity <= 0) { results.push(null); continue; }
      const [key, value] = args;
      if (vals.has(key)) {
        vals.set(key, value);
        touch(key);
      } else {
        if (vals.size >= capacity) {
          const evictSet = freqGroups.get(minFreq);
          const evictKey = evictSet.values().next().value;
          evictSet.delete(evictKey);
          if (evictSet.size === 0) freqGroups.delete(minFreq);
          vals.delete(evictKey);
          freqs.delete(evictKey);
        }
        vals.set(key, value);
        freqs.set(key, 1);
        if (!freqGroups.has(1)) freqGroups.set(1, new Set());
        freqGroups.get(1).add(key);
        minFreq = 1;
      }
      results.push(null);
    } else {
      const [key] = args;
      if (!vals.has(key)) { results.push(-1); }
      else { const v = vals.get(key); touch(key); results.push(v); }
    }
  }
  return results;
}`,solutions:[{approach:`HashMap + Frequency Buckets`,timeComplexity:`O(1) per operation`,spaceComplexity:`O(capacity)`,explanation:`Track each key's frequency and group keys into per-frequency Sets, plus a running minFreq pointer. Eviction just pulls the oldest key out of the minFreq group — no scanning required, since Set iteration order preserves insertion order for the least-recently-touched tie-break.`,code:`function lfuCacheOperations(capacity, ops, argsList) {
  const vals = new Map();
  const freqs = new Map();
  const freqGroups = new Map();
  let minFreq = 0;
  function touch(key) {
    const f = freqs.get(key);
    freqGroups.get(f).delete(key);
    if (freqGroups.get(f).size === 0) {
      freqGroups.delete(f);
      if (minFreq === f) minFreq = f + 1;
    }
    freqs.set(key, f + 1);
    if (!freqGroups.has(f + 1)) freqGroups.set(f + 1, new Set());
    freqGroups.get(f + 1).add(key);
  }
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], args = argsList[i];
    if (op === 'put') {
      if (capacity <= 0) { results.push(null); continue; }
      const [key, value] = args;
      if (vals.has(key)) {
        vals.set(key, value);
        touch(key);
      } else {
        if (vals.size >= capacity) {
          const evictSet = freqGroups.get(minFreq);
          const evictKey = evictSet.values().next().value;
          evictSet.delete(evictKey);
          if (evictSet.size === 0) freqGroups.delete(minFreq);
          vals.delete(evictKey);
          freqs.delete(evictKey);
        }
        vals.set(key, value);
        freqs.set(key, 1);
        if (!freqGroups.has(1)) freqGroups.set(1, new Set());
        freqGroups.get(1).add(key);
        minFreq = 1;
      }
      results.push(null);
    } else {
      const [key] = args;
      if (!vals.has(key)) { results.push(-1); }
      else { const v = vals.get(key); touch(key); results.push(v); }
    }
  }
  return results;
}`},{approach:`Brute-force array (linear scan for lowest frequency)`,timeComplexity:`O(n) per operation`,spaceComplexity:`O(n)`,explanation:`Keep a plain array of {key, value, freq, order}. Every get/put has to scan the whole array to find the entry (O(n)), and eviction rescans it again to find the min-frequency, oldest-order entry (O(n)). Correct, but linear cost on every single operation.`,code:`function lfuCacheOperations(capacity, ops, argsList) {
  let entries = [];
  let counter = 0;
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], args = argsList[i];
    if (op === 'put') {
      if (capacity <= 0) { results.push(null); continue; }
      const [key, value] = args;
      const idx = entries.findIndex((e) => e.key === key);
      if (idx !== -1) {
        entries[idx].value = value;
        entries[idx].freq++;
        entries[idx].order = counter++;
      } else {
        if (entries.length >= capacity) {
          let evictIdx = 0;
          for (let j = 1; j < entries.length; j++) {
            if (entries[j].freq < entries[evictIdx].freq ||
                (entries[j].freq === entries[evictIdx].freq && entries[j].order < entries[evictIdx].order)) {
              evictIdx = j;
            }
          }
          entries.splice(evictIdx, 1);
        }
        entries.push({ key, value, freq: 1, order: counter++ });
      }
      results.push(null);
    } else {
      const [key] = args;
      const idx = entries.findIndex((e) => e.key === key);
      if (idx === -1) { results.push(-1); }
      else {
        entries[idx].freq++;
        entries[idx].order = counter++;
        results.push(entries[idx].value);
      }
    }
  }
  return results;
}`}]}]},{id:`sysdes-traffic-control`,name:`Traffic Control`,explanation:`Deciding whether a request should even be allowed to proceed. See 'Rate Limiting' and 'Idempotency' in the glossary.`,problems:[{id:`sysdes-rate-limiter`,title:`Rate Limiter (Rate Limiting)`,difficulty:`Medium`,description:`Codes the 'Rate Limiting' glossary term. Given maxRequests, windowMs, and an array of request timestamps (ms, ascending), return one boolean per timestamp: true if that request is allowed under a sliding 'maxRequests per windowMs' policy, false if it should be rejected.`,fnName:`rateLimiterOperations`,starterCode:`function rateLimiterOperations(maxRequests, windowMs, timestamps) {
  // your code here
}`,testCases:[{input:[3,1e3,[0,10,20,30,2e3,2010,2020,2030]],expected:[!0,!0,!0,!1,!0,!0,!0,!1]},{input:[1,100,[5,50,200]],expected:[!0,!1,!0]}],solution:`function rateLimiterOperations(maxRequests, windowMs, timestamps) {
  let windowStart = null, count = 0;
  const results = [];
  for (const t of timestamps) {
    const windowIndex = Math.floor(t / windowMs);
    if (windowStart === null || windowIndex !== windowStart) { windowStart = windowIndex; count = 0; }
    if (count < maxRequests) { count++; results.push(true); } else { results.push(false); }
  }
  return results;
}`,solutions:[{approach:`Fixed Window Counter`,timeComplexity:`O(1) per request`,spaceComplexity:`O(1)`,explanation:`Just a counter that resets when the timestamp crosses into a new windowMs-sized bucket. Cheapest option, but the classic flaw: a burst straddling a window boundary can let through up to ~2x maxRequests in a short span, since each half-window is counted independently.`,code:`function rateLimiterOperations(maxRequests, windowMs, timestamps) {
  let windowStart = null, count = 0;
  const results = [];
  for (const t of timestamps) {
    const windowIndex = Math.floor(t / windowMs);
    if (windowStart === null || windowIndex !== windowStart) { windowStart = windowIndex; count = 0; }
    if (count < maxRequests) { count++; results.push(true); } else { results.push(false); }
  }
  return results;
}`},{approach:`Sliding Window Log`,timeComplexity:`O(k) per request, k = requests currently in window`,spaceComplexity:`O(k)`,explanation:`Store the timestamp of every allowed request; on each new request, prune entries older than windowMs then check the remaining count. Exact — no boundary-burst flaw — at the cost of storing and scanning a log per client instead of one counter.`,code:`function rateLimiterOperations(maxRequests, windowMs, timestamps) {
  const log = [];
  const results = [];
  for (const t of timestamps) {
    while (log.length && log[0] <= t - windowMs) log.shift();
    if (log.length < maxRequests) { log.push(t); results.push(true); } else { results.push(false); }
  }
  return results;
}`}]},{id:`sysdes-idempotency-store`,title:`Idempotency Key Store (Idempotency)`,difficulty:`Easy`,description:`Codes the 'Idempotency' glossary term. Given a sequence of request IDs, return one boolean per request: true if this is the first time that ID has been seen (safe to actually process it), false if it's a duplicate (already processed, skip it) — the mechanism that prevents a retried network call from double-charging.`,fnName:`idempotencyOperations`,starterCode:`function idempotencyOperations(requestIds) {
  // your code here
}`,testCases:[{input:[[`a`,`b`,`a`,`c`,`b`,`b`,`d`]],expected:[!0,!0,!1,!0,!1,!1,!0]}],solution:`function idempotencyOperations(requestIds) {
  const seen = new Set();
  return requestIds.map((id) => { if (seen.has(id)) return false; seen.add(id); return true; });
}`,solutions:[{approach:`HashSet`,timeComplexity:`O(1) per operation`,spaceComplexity:`O(n)`,explanation:`A Set gives O(1) membership checks — the standard way an API gateway dedupes retried requests.`,code:`function idempotencyOperations(requestIds) {
  const seen = new Set();
  return requestIds.map((id) => { if (seen.has(id)) return false; seen.add(id); return true; });
}`},{approach:`Brute-force array scan`,timeComplexity:`O(n) per operation`,spaceComplexity:`O(n)`,explanation:"Same idea, but `.includes` rescans everything seen so far — correct, just needlessly slower.",code:`function idempotencyOperations(requestIds) {
  const seen = [];
  return requestIds.map((id) => { if (seen.includes(id)) return false; seen.push(id); return true; });
}`}]}]},{id:`sysdes-search`,name:`Search & Indexing`,explanation:`Structures purpose-built for fast prefix/substring lookups over large text.`,problems:[{id:`sysdes-autocomplete`,title:`Prefix Autocomplete (Search-as-you-type)`,difficulty:`Medium`,description:`A common frontend companion to 'Query Optimization' / search indexing: given a dictionary of words and a list of query prefixes, return the (alphabetically sorted) words matching each prefix.`,fnName:`autocompleteOperations`,starterCode:`function autocompleteOperations(dictionary, prefixes) {
  // your code here
}`,testCases:[{input:[[`cat`,`car`,`cart`,`dog`,`do`,`door`,`cats`],[`ca`,`do`,`z`,`cart`]],expected:[[`car`,`cart`,`cat`,`cats`],[`do`,`dog`,`door`],[],[`cart`]]}],normalize:e=>Array.isArray(e)?e.map(e=>Array.isArray(e)?[...e].sort():e):e,solution:`function autocompleteOperations(dictionary, prefixes) {
  const root = {};
  for (const word of dictionary) {
    let node = root;
    for (const ch of word) { node[ch] = node[ch] || {}; node = node[ch]; }
    node.$end = word;
  }
  function collect(node, out) {
    if (node.$end) out.push(node.$end);
    for (const ch in node) { if (ch !== '$end') collect(node[ch], out); }
  }
  return prefixes.map((prefix) => {
    let node = root;
    for (const ch of prefix) { if (!node[ch]) return []; node = node[ch]; }
    const out = [];
    collect(node, out);
    return out.sort();
  });
}`,solutions:[{approach:`Trie`,timeComplexity:`O(m + results) per query, m = prefix length`,spaceComplexity:`O(total characters in dictionary)`,explanation:`Build a trie once from the dictionary. Each query walks m characters to the prefix's node, then collects whatever words hang below it — cost scales with the prefix and the match count, not the dictionary size.`,code:`function autocompleteOperations(dictionary, prefixes) {
  const root = {};
  for (const word of dictionary) {
    let node = root;
    for (const ch of word) { node[ch] = node[ch] || {}; node = node[ch]; }
    node.$end = word;
  }
  function collect(node, out) {
    if (node.$end) out.push(node.$end);
    for (const ch in node) { if (ch !== '$end') collect(node[ch], out); }
  }
  return prefixes.map((prefix) => {
    let node = root;
    for (const ch of prefix) { if (!node[ch]) return []; node = node[ch]; }
    const out = [];
    collect(node, out);
    return out.sort();
  });
}`},{approach:`Brute-force scan`,timeComplexity:`O(queries * dictionarySize * wordLength)`,spaceComplexity:`O(1) extra`,explanation:`Re-filter the whole dictionary for every query. No setup cost, but doesn't scale with traffic.`,code:`function autocompleteOperations(dictionary, prefixes) {
  return prefixes.map((prefix) => dictionary.filter((w) => w.startsWith(prefix)).sort());
}`}]},{id:`sysdes-inverted-index`,title:`Inverted Index Search (Search-as-you-type)`,difficulty:`Medium`,description:`The structure behind whole-word search (as opposed to autocomplete's prefix search) — the same idea search engines and log search tools use under 'Query Optimization'. Given a list of documents and a list of single-word queries, return the (ascending-sorted) document indices where each queried word appears. Word matching is case-insensitive and punctuation-insensitive.`,fnName:`buildAndQuery`,starterCode:`function buildAndQuery(documents, queries) {
  // your code here
}`,testCases:[{input:[[`the quick brown fox`,`the lazy dog`,`quick dogs run`],[`quick`,`the`,`dog`,`cat`]],expected:[[0,2],[0,1],[1],[]]},{input:[[``],[`anything`]],expected:[[]]}],solution:`function buildAndQuery(documents, queries) {
  const index = new Map();
  documents.forEach((doc, docIdx) => {
    const words = new Set(doc.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
    for (const w of words) {
      if (!index.has(w)) index.set(w, new Set());
      index.get(w).add(docIdx);
    }
  });
  return queries.map((q) => {
    const set = index.get(q.toLowerCase());
    return set ? [...set].sort((a, b) => a - b) : [];
  });
}`,solutions:[{approach:`Inverted Index (word -> Set of document indices)`,timeComplexity:`O(D + Q) — D = total words across all documents, Q = number of queries`,spaceComplexity:`O(D) — one index entry per distinct (word, document) pair`,explanation:`Build the word -> documents map once, up front, in a single pass over every document. After that, each query is a single map lookup — the cost of searching never grows with the number of documents once the index exists, which is exactly why real search engines build an index instead of grepping the corpus per query.`,code:`function buildAndQuery(documents, queries) {
  const index = new Map();
  documents.forEach((doc, docIdx) => {
    const words = new Set(doc.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
    for (const w of words) {
      if (!index.has(w)) index.set(w, new Set());
      index.get(w).add(docIdx);
    }
  });
  return queries.map((q) => {
    const set = index.get(q.toLowerCase());
    return set ? [...set].sort((a, b) => a - b) : [];
  });
}`},{approach:`Brute-force scan (re-tokenize every document per query)`,timeComplexity:`O(Q * D) — rescans every document's words for every query`,spaceComplexity:`O(1) extra`,explanation:`No index, no setup cost — but every query re-tokenizes and re-scans the entire document set from scratch. Fine for a handful of one-off searches, falls over as either the corpus or the query volume grows.`,code:`function buildAndQuery(documents, queries) {
  return queries.map((q) => {
    const target = q.toLowerCase();
    const matches = [];
    documents.forEach((doc, docIdx) => {
      const words = doc.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      if (words.includes(target)) matches.push(docIdx);
    });
    return matches;
  });
}`}]}]},{id:`sysdes-distributed-coordination`,name:`Distributed Coordination`,explanation:`How independent nodes agree on group membership. See 'Leader Election' and 'Service Discovery' in the glossary.`,problems:[{id:`sysdes-cluster-connectivity`,title:`Cluster Connectivity (Leader Election / Service Discovery)`,difficulty:`Medium`,description:`Codes the union/find machinery under 'Leader Election' and 'Service Discovery' — nodes that merge into the same group when they discover each other. Given numNodes and a sequence of union(a,b)/connected(a,b) operations, return one result per operation: null for union, boolean for connected.`,fnName:`clusterConnectivityOperations`,starterCode:`function clusterConnectivityOperations(numNodes, ops, argsList) {
  // your code here
}`,testCases:[{input:[6,[`union`,`union`,`connected`,`connected`,`union`,`connected`],[[0,1],[1,2],[0,2],[0,3],[3,4],[0,4]]],expected:[null,null,!0,!1,null,!1]}],solution:`function clusterConnectivityOperations(numNodes, ops, argsList) {
  const parent = Array.from({ length: numNodes }, (_, i) => i);
  const rank = new Array(numNodes).fill(0);
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
  }
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const [a, b] = argsList[i];
    if (ops[i] === 'union') { union(a, b); results.push(null); }
    else { results.push(find(a) === find(b)); }
  }
  return results;
}`,solutions:[{approach:`Union-Find (path compression + union by rank)`,timeComplexity:`O(α(n)) per operation — effectively constant`,spaceComplexity:`O(n)`,explanation:`Path compression flattens the tree every time find() is called, and union-by-rank keeps it from growing tall in the first place. Together they make near-constant-time cluster membership checks at any scale.`,code:`function clusterConnectivityOperations(numNodes, ops, argsList) {
  const parent = Array.from({ length: numNodes }, (_, i) => i);
  const rank = new Array(numNodes).fill(0);
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
  }
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const [a, b] = argsList[i];
    if (ops[i] === 'union') { union(a, b); results.push(null); }
    else { results.push(find(a) === find(b)); }
  }
  return results;
}`},{approach:`Naive adjacency list + BFS`,timeComplexity:`O(V + E) per connected() query`,spaceComplexity:`O(V + E)`,explanation:`union() just records an edge (cheap), but connected() has to walk the graph from scratch every time to prove two nodes are reachable. Fine for a handful of checks, falls over as the cluster and query volume grow.`,code:`function clusterConnectivityOperations(numNodes, ops, argsList) {
  const adj = Array.from({ length: numNodes }, () => []);
  function connected(a, b) {
    if (a === b) return true;
    const seen = new Set([a]);
    const queue = [a];
    while (queue.length) {
      const cur = queue.shift();
      for (const next of adj[cur]) {
        if (next === b) return true;
        if (!seen.has(next)) { seen.add(next); queue.push(next); }
      }
    }
    return false;
  }
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const [a, b] = argsList[i];
    if (ops[i] === 'union') { adj[a].push(b); adj[b].push(a); results.push(null); }
    else { results.push(connected(a, b)); }
  }
  return results;
}`}]},{id:`sysdes-consistent-hashing`,title:`Consistent Hashing Ring (Leader Election / Service Discovery)`,difficulty:`Hard`,description:`The routing scheme behind 'Service Discovery' at scale: instead of a plain key % numNodes (which reshuffles almost every key whenever a node joins or leaves), hash both nodes and keys onto the same ring and route each key to the first node clockwise from it. Given a sequence of addNode(name)/removeNode(name)/route(key) operations, return one result per operation: null for add/remove, the owning node's name for route (or null if the ring is empty).

ops[i] is "addNode", "removeNode", or "route"; argsList[i] holds that operation's single argument.`,fnName:`consistentHashingOperations`,starterCode:`function consistentHashingOperations(ops, argsList) {
  // your code here
}`,testCases:[{input:[[`addNode`,`addNode`,`addNode`,`route`,`route`,`route`,`removeNode`,`route`],[[`node-a`],[`node-b`],[`node-c`],[`user:1`],[`user:2`],[`user:3`],[`node-b`],[`user:2`]]],expected:[null,null,null,`node-a`,`node-a`,`node-a`,null,`node-a`]},{input:[[`route`],[[`user:1`]]],expected:[null]}],solution:`function consistentHashingOperations(ops, argsList) {
  const RING_SIZE = 1000;
  function ringHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % RING_SIZE;
    return h;
  }
  function lowerBound(nodes, hash) {
    let lo = 0, hi = nodes.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nodes[mid].hash < hash) lo = mid + 1; else hi = mid;
    }
    return lo;
  }
  let nodes = [];
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], args = argsList[i];
    if (op === 'addNode') {
      const [name] = args;
      const hash = ringHash(name);
      nodes.splice(lowerBound(nodes, hash), 0, { hash, name });
      results.push(null);
    } else if (op === 'removeNode') {
      const [name] = args;
      nodes = nodes.filter((n) => n.name !== name);
      results.push(null);
    } else {
      const [key] = args;
      if (nodes.length === 0) { results.push(null); continue; }
      const pos = lowerBound(nodes, ringHash(key));
      results.push((pos < nodes.length ? nodes[pos] : nodes[0]).name);
    }
  }
  return results;
}`,solutions:[{approach:`Sorted ring + binary search`,timeComplexity:`O(log n) per route lookup, O(n) per add/remove (array splice)`,spaceComplexity:`O(n) — n = number of nodes`,explanation:`Keep nodes sorted by their ring position so route() can binary-search for the first node clockwise of a key instead of scanning. route() is by far the most frequent operation in a real deployment (nodes join/leave rarely, keys route constantly), so this is the operation worth optimizing.`,code:`function consistentHashingOperations(ops, argsList) {
  const RING_SIZE = 1000;
  function ringHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % RING_SIZE;
    return h;
  }
  function lowerBound(nodes, hash) {
    let lo = 0, hi = nodes.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nodes[mid].hash < hash) lo = mid + 1; else hi = mid;
    }
    return lo;
  }
  let nodes = [];
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], args = argsList[i];
    if (op === 'addNode') {
      const [name] = args;
      const hash = ringHash(name);
      nodes.splice(lowerBound(nodes, hash), 0, { hash, name });
      results.push(null);
    } else if (op === 'removeNode') {
      const [name] = args;
      nodes = nodes.filter((n) => n.name !== name);
      results.push(null);
    } else {
      const [key] = args;
      if (nodes.length === 0) { results.push(null); continue; }
      const pos = lowerBound(nodes, ringHash(key));
      results.push((pos < nodes.length ? nodes[pos] : nodes[0]).name);
    }
  }
  return results;
}`},{approach:`Unsorted array, linear scan every operation`,timeComplexity:`O(n) per operation, including route`,spaceComplexity:`O(n)`,explanation:`Skip maintaining sorted order — just append on addNode, filter on removeNode, and walk the full node list on every route() to find the closest clockwise hash. Simpler to write, but route() degrades linearly with cluster size instead of logarithmically.`,code:`function consistentHashingOperations(ops, argsList) {
  const RING_SIZE = 1000;
  function ringHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % RING_SIZE;
    return h;
  }
  let nodes = [];
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], args = argsList[i];
    if (op === 'addNode') {
      const [name] = args;
      nodes.push({ hash: ringHash(name), name });
      results.push(null);
    } else if (op === 'removeNode') {
      const [name] = args;
      nodes = nodes.filter((n) => n.name !== name);
      results.push(null);
    } else {
      const [key] = args;
      if (nodes.length === 0) { results.push(null); continue; }
      const hash = ringHash(key);
      let owner = null;
      for (const n of nodes) { if (n.hash >= hash && (!owner || n.hash < owner.hash)) owner = n; }
      if (!owner) { for (const n of nodes) { if (!owner || n.hash < owner.hash) owner = n; } }
      results.push(owner.name);
    }
  }
  return results;
}`}]}]},{id:`sysdes-probabilistic`,name:`Probabilistic Structures`,explanation:`Trading a small, bounded error rate for a large reduction in memory or time.`,problems:[{id:`sysdes-bloom-filter`,title:`Bloom Filter Membership (Data Operations)`,difficulty:`Medium`,description:`A probabilistic sibling of 'Database Indexing' for existence checks: given items to insert and items to query, return whether each queried item 'might exist' (true) or 'definitely does not exist' (false). False positives are an accepted tradeoff for a probabilistic structure; false negatives are never allowed.`,fnName:`bloomFilterOperations`,starterCode:`function bloomFilterOperations(insertItems, queryItems) {
  // your code here
}`,testCases:[{input:[[`apple`,`banana`],[`apple`,`cherry`]],expected:[!0,!1]}],solution:`function bloomFilterOperations(insertItems, queryItems) {
  const set = new Set(insertItems);
  return queryItems.map((q) => set.has(q));
}`,solutions:[{approach:`Exact HashSet`,timeComplexity:`O(1) per operation`,spaceComplexity:`O(n) — one full entry per inserted item`,explanation:`Perfectly accurate and just as fast as a bloom filter for a single lookup, but it has to store every item in full. Fine until n gets large enough that memory is the actual constraint.`,code:`function bloomFilterOperations(insertItems, queryItems) {
  const set = new Set(insertItems);
  return queryItems.map((q) => set.has(q));
}`},{approach:`Bloom Filter (2 hash functions, fixed-size bit array)`,timeComplexity:`O(k) per operation, k = number of hash functions`,spaceComplexity:`O(bits) — fixed, independent of item size or count`,explanation:`Hash each item k ways into a shared bit array and set those bits. A query only returns true if ALL k of its bits are set. Uses a fraction of the memory of a real set at the cost of possible false positives (never false negatives) — exactly the tradeoff CDNs and databases make to avoid checking disk/network for a key that almost certainly doesn't exist.`,code:`function bloomFilterOperations(insertItems, queryItems) {
  const size = 64;
  const bits = new Array(size).fill(false);
  function hash1(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h % size; }
  function hash2(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 37 + str.charCodeAt(i) * 7) >>> 0; return h % size; }
  for (const item of insertItems) { bits[hash1(item)] = true; bits[hash2(item)] = true; }
  return queryItems.map((q) => bits[hash1(q)] && bits[hash2(q)]);
}`}]},{id:`sysdes-count-min-sketch`,title:`Count-Min Sketch (Data Operations)`,difficulty:`Medium`,description:`A probabilistic sibling of Bloom Filter, but for counts instead of membership: given a fixed table width/depth and a sequence of add(item)/estimate(item) operations, return one result per operation: null for add, the estimated count for estimate. Estimates can only ever be an OVER-count (hash collisions inflate a count, they never lose one) — the same tradeoff a CDN or rate limiter makes to track approximate per-key traffic without a per-key counter.`,fnName:`countMinSketchOperations`,starterCode:`function countMinSketchOperations(width, depth, ops, argsList) {
  // your code here
}`,testCases:[{input:[16,3,[`add`,`add`,`add`,`estimate`,`estimate`,`estimate`],[[`a`],[`a`],[`b`],[`a`],[`b`],[`c`]]],expected:[null,null,null,2,1,0]}],solution:`function countMinSketchOperations(width, depth, ops, argsList) {
  const table = Array.from({ length: depth }, () => new Array(width).fill(0));
  const seeds = Array.from({ length: depth }, (_, i) => 31 + i * 2);
  function hashRow(item, row) {
    let h = 0;
    for (let i = 0; i < item.length; i++) h = (h * seeds[row] + item.charCodeAt(i)) % width;
    return ((h % width) + width) % width;
  }
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], [item] = argsList[i];
    if (op === 'add') {
      for (let row = 0; row < depth; row++) table[row][hashRow(item, row)]++;
      results.push(null);
    } else {
      let est = Infinity;
      for (let row = 0; row < depth; row++) est = Math.min(est, table[row][hashRow(item, row)]);
      results.push(est);
    }
  }
  return results;
}`,solutions:[{approach:`Count-Min Sketch (fixed-size table, k independent hashes)`,timeComplexity:`O(depth) per operation — depth is a small fixed constant, independent of cardinality`,spaceComplexity:`O(width * depth) — fixed, no matter how many distinct items are ever seen`,explanation:`Every item is hashed depth independent ways into a shared width-wide counter table; add() increments all depth cells, estimate() reads the minimum across them (the row least corrupted by collisions). Memory never grows with the number of distinct items — the entire point when tracking cardinalities too large to give every key its own counter.`,code:`function countMinSketchOperations(width, depth, ops, argsList) {
  const table = Array.from({ length: depth }, () => new Array(width).fill(0));
  const seeds = Array.from({ length: depth }, (_, i) => 31 + i * 2);
  function hashRow(item, row) {
    let h = 0;
    for (let i = 0; i < item.length; i++) h = (h * seeds[row] + item.charCodeAt(i)) % width;
    return ((h % width) + width) % width;
  }
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], [item] = argsList[i];
    if (op === 'add') {
      for (let row = 0; row < depth; row++) table[row][hashRow(item, row)]++;
      results.push(null);
    } else {
      let est = Infinity;
      for (let row = 0; row < depth; row++) est = Math.min(est, table[row][hashRow(item, row)]);
      results.push(est);
    }
  }
  return results;
}`},{approach:`Raw event log (exact counting, unbounded memory)`,timeComplexity:`O(1) per add, O(n) per estimate — n = number of adds so far`,spaceComplexity:`O(n) — stores every raw event, grows forever`,explanation:`Just append every add()'d item to a list and count matching entries on estimate() by scanning the whole log. Always exact, never over-counts — but memory is unbounded and estimate() gets slower the longer the stream runs, which is exactly what the sketch exists to avoid.`,code:`function countMinSketchOperations(width, depth, ops, argsList) {
  const events = [];
  const results = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], [item] = argsList[i];
    if (op === 'add') {
      events.push(item);
      results.push(null);
    } else {
      let count = 0;
      for (const e of events) { if (e === item) count++; }
      results.push(count);
    }
  }
  return results;
}`}]}]},{id:`sysdes-observability`,name:`Observability & Metrics`,explanation:`Turning raw event streams into the aggregates a dashboard actually shows.`,problems:[{id:`sysdes-top-k-frequent`,title:`Top-K Frequent Items (Observability / Performance Metrics)`,difficulty:`Medium`,description:`The 'what are my most-hit endpoints' query behind any metrics dashboard: given a stream of items and a count k, return the k most frequent items.`,fnName:`topKFrequentItems`,starterCode:`function topKFrequentItems(items, k) {
  // your code here
}`,testCases:[{input:[[`a`,`a`,`a`,`a`,`b`,`b`,`b`,`c`,`c`,`d`],2],expected:[`a`,`b`]},{input:[[`a`,`a`,`a`,`a`,`b`,`b`,`b`,`c`,`c`,`d`],3],expected:[`a`,`b`,`c`]}],cSignature:{params:[{kind:`stringArray`,name:`items`,sizeName:`itemsSize`},{kind:`int`,name:`k`}],returns:{kind:`stringArray`}},normalize:e=>Array.isArray(e)?[...e].sort():e,solution:`function topKFrequentItems(items, k) {
  const freq = new Map();
  for (const it of items) freq.set(it, (freq.get(it) || 0) + 1);
  const buckets = Array.from({ length: items.length + 1 }, () => []);
  for (const [item, count] of freq) buckets[count].push(item);
  const result = [];
  for (let count = buckets.length - 1; count >= 0 && result.length < k; count--) {
    for (const item of buckets[count]) { if (result.length < k) result.push(item); }
  }
  return result;
}`,solutions:[{approach:`Bucket Sort by frequency`,timeComplexity:`O(n)`,spaceComplexity:`O(n)`,explanation:`Frequency can never exceed n, so bucket items by their count (index = count) and read buckets off from the top. Linear — no comparison sort needed at all.`,code:`function topKFrequentItems(items, k) {
  const freq = new Map();
  for (const it of items) freq.set(it, (freq.get(it) || 0) + 1);
  const buckets = Array.from({ length: items.length + 1 }, () => []);
  for (const [item, count] of freq) buckets[count].push(item);
  const result = [];
  for (let count = buckets.length - 1; count >= 0 && result.length < k; count--) {
    for (const item of buckets[count]) { if (result.length < k) result.push(item); }
  }
  return result;
}`},{approach:`Min-Heap of size k`,timeComplexity:`O(n log k)`,spaceComplexity:`O(n + k)`,explanation:`Push every (item, count) pair through a size-capped min-heap, popping the smallest whenever it exceeds k. Never sorts the full frequency table — useful when k is small relative to the number of distinct items.`,code:`function topKFrequentItems(items, k) {
  const freq = new Map();
  for (const it of items) freq.set(it, (freq.get(it) || 0) + 1);
  const entries = [...freq.entries()];
  const heap = [];
  function push(entry) {
    heap.push(entry);
    let i = heap.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (heap[p][1] <= heap[i][1]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
  }
  function pop() {
    const top = heap[0], last = heap.pop();
    if (heap.length) { heap[0] = last; let i = 0;
      while (true) { let s = i, l = 2*i+1, r = 2*i+2;
        if (l < heap.length && heap[l][1] < heap[s][1]) s = l;
        if (r < heap.length && heap[r][1] < heap[s][1]) s = r;
        if (s === i) break; [heap[s], heap[i]] = [heap[i], heap[s]]; i = s; }
    }
    return top;
  }
  for (const entry of entries) { push(entry); if (heap.length > k) pop(); }
  return heap.map(([item]) => item);
}`},{approach:`Full sort by frequency`,timeComplexity:`O(n log n)`,spaceComplexity:`O(n)`,explanation:`Sort every distinct item by count descending, take the first k. Simplest to write, but does more work than the answer needs.`,code:`function topKFrequentItems(items, k) {
  const freq = new Map();
  for (const it of items) freq.set(it, (freq.get(it) || 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([item]) => item);
}`}]},{id:`sysdes-sliding-window-aggregator`,title:`Sliding Window Metrics Aggregator (Observability / Performance Metrics)`,difficulty:`Medium`,description:`The 'what's my request rate over the last N seconds' query behind any live dashboard: given a list of [timestamp, value] events sorted by ascending timestamp, a window size, and a list of ascending-sorted query timestamps, return the sum of event values with timestamp in (q - windowSize, q] for each query q.`,fnName:`slidingWindowAggregator`,starterCode:`function slidingWindowAggregator(events, windowSize, queries) {
  // your code here
}`,testCases:[{input:[[[1,5],[2,3],[4,2],[5,10],[9,1]],5,[2,5,9,10]],expected:[8,20,11,1]},{input:[[[0,1],[1,1],[2,1]],1,[0,1,2,3]],expected:[1,1,1,0]}],solution:`function slidingWindowAggregator(events, windowSize, queries) {
  let left = 0, right = 0, sum = 0;
  const results = [];
  for (const q of queries) {
    while (right < events.length && events[right][0] <= q) { sum += events[right][1]; right++; }
    while (left < right && events[left][0] <= q - windowSize) { sum -= events[left][1]; left++; }
    results.push(sum);
  }
  return results;
}`,solutions:[{approach:`Two-pointer sliding window`,timeComplexity:`O(events + queries) total — each pointer only ever moves forward`,spaceComplexity:`O(1) extra`,explanation:`Since both events and queries are sorted ascending, a right pointer admits events up to the current query time and a left pointer evicts events that fell out of the window — neither pointer ever moves backward, so the whole pass across every query is linear, not quadratic. This is the streaming/windowed-aggregation trick behind live dashboards that can't afford to rescan history per query.`,code:`function slidingWindowAggregator(events, windowSize, queries) {
  let left = 0, right = 0, sum = 0;
  const results = [];
  for (const q of queries) {
    while (right < events.length && events[right][0] <= q) { sum += events[right][1]; right++; }
    while (left < right && events[left][0] <= q - windowSize) { sum -= events[left][1]; left++; }
    results.push(sum);
  }
  return results;
}`},{approach:`Brute-force rescan per query`,timeComplexity:`O(events * queries) — rescans every event for every query`,spaceComplexity:`O(1) extra`,explanation:`For each query, walk the entire event list and sum whatever falls in the window. Doesn't require queries to be sorted, but redoes the full scan from scratch every time — fine for a one-off report, not for a dashboard refreshing every second.`,code:`function slidingWindowAggregator(events, windowSize, queries) {
  return queries.map((q) => {
    let sum = 0;
    for (const [t, v] of events) { if (t > q - windowSize && t <= q) sum += v; }
    return sum;
  });
}`}]}]}]},p={id:`queue-deque`,name:`Queue / Deque`,subpatterns:[{id:`queue-deque-sliding-window-maximum`,name:`Sliding Window Maximum`,explanation:`Maintain a deque of indices with strictly decreasing values; the front is always the current window's maximum, and stale or dominated indices are evicted as the window slides.`,problems:[{id:`queue-deque-max-sliding-window`,title:`Sliding Window Maximum`,difficulty:`Hard`,description:`Given an array nums and a window size k, return an array of the maximum value in each window as it slides from the start of the array to the end.`,fnName:`maxSlidingWindow`,starterCode:`function maxSlidingWindow(nums, k) {
  // your code here
}`,testCases:[{input:[[1,3,-1,-3,5,3,6,7],3],expected:[3,3,5,5,6,7]},{input:[[1],1],expected:[1]},{input:[[9,11],2],expected:[11]},{input:[[4,-2],2],expected:[4]},{input:[[1,3,1,2,0,5],3],expected:[3,3,2,5]}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`int`,name:`k`}],returns:{kind:`intArray`}},solution:`function maxSlidingWindow(nums, k) {
  const dq = [];
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]] < nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) res.push(nums[dq[0]]);
  }
  return res;
}`,solutions:[{approach:`Monotonic Deque`,timeComplexity:`O(n)`,spaceComplexity:`O(k)`,explanation:`Keep a deque of indices whose values are decreasing front-to-back. Evict indices that fell out of the window from the front, and evict indices with a smaller value than the incoming one from the back (they can never be the max again). The front is always the current window's max.`,code:`function maxSlidingWindow(nums, k) {
  const dq = [];
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]] < nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) res.push(nums[dq[0]]);
  }
  return res;
}`},{approach:`Brute force — Math.max over each window`,timeComplexity:`O(n * k)`,spaceComplexity:`O(1) extra`,explanation:`Slice out every window and scan it for the max. Correct, but re-examines every element in the window again on each slide instead of reusing work from the previous window.`,code:`function maxSlidingWindow(nums, k) {
  const res = [];
  for (let i = 0; i + k <= nums.length; i++) {
    res.push(Math.max(...nums.slice(i, i + k)));
  }
  return res;
}`}]}]},{id:`queue-deque-first-negative-in-window`,name:`First Negative in Window`,explanation:`A deque holding only the indices of negative numbers turns 'find the first negative in this window' into a front-of-deque read instead of a rescan.`,problems:[{id:`queue-deque-first-negative-in-window`,title:`First Negative Number in Every Window of Size K`,difficulty:`Medium`,description:`Given an array nums and a window size k, return an array where entry i is the first negative number in the window of size k ending at index i, or 0 if that window has no negative number.`,fnName:`firstNegativeInWindow`,starterCode:`function firstNegativeInWindow(nums, k) {
  // your code here
}`,testCases:[{input:[[12,-1,-7,8,-15,30,16,28],3],expected:[-1,-1,-7,-15,-15,0]},{input:[[-8,2,3,-6,10],2],expected:[-8,0,-6,-6]},{input:[[5,-3,5],2],expected:[-3,-3]},{input:[[1,2,3],2],expected:[0,0]}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`int`,name:`k`}],returns:{kind:`intArray`}},solution:`function firstNegativeInWindow(nums, k) {
  const dq = [];
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 0) dq.push(i);
    while (dq.length && dq[0] <= i - k) dq.shift();
    if (i >= k - 1) res.push(dq.length ? nums[dq[0]] : 0);
  }
  return res;
}`,solutions:[{approach:`Deque of negative-value indices`,timeComplexity:`O(n)`,spaceComplexity:`O(k)`,explanation:`Only push indices whose value is negative onto the deque, in increasing order. Evict indices that fell out of the window from the front; whatever remains at the front is the earliest still-in-window negative, or the window has none if the deque is empty.`,code:`function firstNegativeInWindow(nums, k) {
  const dq = [];
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 0) dq.push(i);
    while (dq.length && dq[0] <= i - k) dq.shift();
    if (i >= k - 1) res.push(dq.length ? nums[dq[0]] : 0);
  }
  return res;
}`},{approach:`Brute force — scan each window`,timeComplexity:`O(n * k)`,spaceComplexity:`O(1) extra`,explanation:`For every window, walk it left to right until a negative number turns up. Correct, but on a window with no negatives it re-walks the full k elements every time instead of remembering that from the previous slide.`,code:`function firstNegativeInWindow(nums, k) {
  const res = [];
  for (let i = 0; i + k <= nums.length; i++) {
    let found = 0;
    for (let j = i; j < i + k; j++) { if (nums[j] < 0) { found = nums[j]; break; } }
    res.push(found);
  }
  return res;
}`}]}]},{id:`queue-deque-deque-optimization`,name:`Deque Optimization`,explanation:`Some window/range problems (especially with negative values, where two-pointer sums break down) can still hit O(n) by keeping a monotonic deque of candidate indices and discarding ones that can provably never be optimal again.`,problems:[{id:`queue-deque-shortest-subarray-at-least-k`,title:`Shortest Subarray with Sum at Least K`,difficulty:`Hard`,description:`Given an integer array nums (which may contain negative numbers) and an integer k, return the length of the shortest contiguous subarray with a sum of at least k, or -1 if no such subarray exists.`,fnName:`shortestSubarray`,starterCode:`function shortestSubarray(nums, k) {
  // your code here
}`,testCases:[{input:[[1],1],expected:1},{input:[[1,2],4],expected:-1},{input:[[2,-1,2],3],expected:3},{input:[[84,-37,32,40,95],167],expected:3},{input:[[-28,81,-20,28,-29],89],expected:3}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`int`,name:`k`}],returns:{kind:`int`}},solution:`function shortestSubarray(nums, k) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const dq = [];
  let best = Infinity;
  for (let i = 0; i <= n; i++) {
    while (dq.length && prefix[i] - prefix[dq[0]] >= k) {
      best = Math.min(best, i - dq.shift());
    }
    while (dq.length && prefix[dq[dq.length - 1]] >= prefix[i]) dq.pop();
    dq.push(i);
  }
  return best === Infinity ? -1 : best;
}`,solutions:[{approach:`Prefix Sum + Monotonic Deque`,timeComplexity:`O(n)`,spaceComplexity:`O(n)`,explanation:`Because nums can hold negatives, prefix sums aren't monotonic, so a plain two-pointer window doesn't work. Instead, keep a deque of prefix-sum indices with increasing prefix value: whenever the current prefix minus the deque's front is >= k, that front index can never beat this match again, so pop and score it; whenever the current prefix is <= the deque's back, the back index is now strictly worse than the current one for every future query, so drop it too. Each index enters and leaves the deque at most once.`,code:`function shortestSubarray(nums, k) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const dq = [];
  let best = Infinity;
  for (let i = 0; i <= n; i++) {
    while (dq.length && prefix[i] - prefix[dq[0]] >= k) {
      best = Math.min(best, i - dq.shift());
    }
    while (dq.length && prefix[dq[dq.length - 1]] >= prefix[i]) dq.pop();
    dq.push(i);
  }
  return best === Infinity ? -1 : best;
}`},{approach:`Brute force — every subarray`,timeComplexity:`O(n^2)`,spaceComplexity:`O(1) extra`,explanation:`Try every start index and extend the end index, stopping the inner loop as soon as the running sum reaches k. Correct for any input, but doesn't reuse the deque's insight that some starting points can be eliminated outright.`,code:`function shortestSubarray(nums, k) {
  const n = nums.length;
  let best = Infinity;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      if (sum >= k) { best = Math.min(best, j - i + 1); break; }
    }
  }
  return best === Infinity ? -1 : best;
}`}]}]},{id:`queue-deque-design-queue`,name:`Design Queue`,explanation:`A FIFO queue can be built from two LIFO stacks: new items go on one stack, and reversing onto a second stack (only when it's empty) restores FIFO order with amortized O(1) cost per operation.`,problems:[{id:`queue-deque-design-queue`,title:`Implement Queue using Two Stacks`,difficulty:`Easy`,description:`Implement a FIFO queue using only two stacks, exercised via a sequence of operations. ops[i] is one of "enqueue", "dequeue", "peek", "isEmpty"; argsList[i] holds that operation's arguments (empty for dequeue/peek/isEmpty). enqueue returns null; dequeue/peek return -1 when the queue is empty.`,fnName:`queueOperations`,starterCode:`function queueOperations(ops, argsList) {
  // your code here
}`,testCases:[{input:[[`enqueue`,`enqueue`,`peek`,`dequeue`,`isEmpty`,`enqueue`,`dequeue`,`dequeue`,`isEmpty`],[[1],[2],[],[],[],[3],[],[],[]]],expected:[null,null,1,1,!1,null,2,3,!0]},{input:[[`dequeue`,`enqueue`,`peek`],[[],[7],[]]],expected:[-1,null,7]}],solution:`function queueOperations(ops, argsList) {
  const inStack = [], outStack = [];
  const out = [];
  function transfer() { while (inStack.length) outStack.push(inStack.pop()); }
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'enqueue') { inStack.push(a[0]); out.push(null); }
    else if (op === 'dequeue') { if (!outStack.length) transfer(); out.push(outStack.length ? outStack.pop() : -1); }
    else if (op === 'peek') { if (!outStack.length) transfer(); out.push(outStack.length ? outStack[outStack.length - 1] : -1); }
    else { out.push(inStack.length === 0 && outStack.length === 0); }
  }
  return out;
}`,solutions:[{approach:`Two stacks, amortized O(1)`,timeComplexity:`O(1) amortized per operation`,spaceComplexity:`O(n)`,explanation:`Push new items onto an 'in' stack. When a dequeue/peek needs the oldest item and the 'out' stack is empty, dump the entire 'in' stack onto 'out' — this reverses it to FIFO order in one pass. Each element only ever gets moved from 'in' to 'out' once across its whole lifetime, so the total work stays linear even though a single dequeue can occasionally be O(n).`,code:`function queueOperations(ops, argsList) {
  const inStack = [], outStack = [];
  const out = [];
  function transfer() { while (inStack.length) outStack.push(inStack.pop()); }
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'enqueue') { inStack.push(a[0]); out.push(null); }
    else if (op === 'dequeue') { if (!outStack.length) transfer(); out.push(outStack.length ? outStack.pop() : -1); }
    else if (op === 'peek') { if (!outStack.length) transfer(); out.push(outStack.length ? outStack[outStack.length - 1] : -1); }
    else { out.push(inStack.length === 0 && outStack.length === 0); }
  }
  return out;
}`},{approach:`Brute force — array with shift()`,timeComplexity:`O(n) per dequeue (Array.shift is linear)`,spaceComplexity:`O(n)`,explanation:`Use a single array, pushing to the end and calling shift() to dequeue from the front. Simple, but shift() re-indexes every remaining element, so it doesn't actually satisfy the 'stacks only, O(1) amortized' constraint the two-stack design is built around.`,code:`function queueOperations(ops, argsList) {
  const arr = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'enqueue') { arr.push(a[0]); out.push(null); }
    else if (op === 'dequeue') { out.push(arr.length ? arr.shift() : -1); }
    else if (op === 'peek') { out.push(arr.length ? arr[0] : -1); }
    else { out.push(arr.length === 0); }
  }
  return out;
}`}]}]}]},m={id:`linked-list`,name:`Linked List`,subpatterns:[{id:`linked-list-fast-slow-pointers`,name:`Fast-Slow Pointers`,explanation:`Two pointers advance through the list at different speeds (typically 1 and 2 steps). Where they meet, or whether the fast one reaches the end first, answers questions like 'where's the middle' or 'is there a cycle' without ever knowing the list's length up front.`,problems:[{id:`linked-list-middle-node`,title:`Middle of the Linked List`,difficulty:`Easy`,description:`Given a singly linked list (represented here as an array of values), return the values from the middle node to the end. If there are two middle nodes, return starting from the second one.`,fnName:`middleNode`,starterCode:`function middleNode(arr) {
  // your code here
}`,testCases:[{input:[[1,2,3,4,5]],expected:[3,4,5]},{input:[[1,2,3,4,5,6]],expected:[4,5,6]},{input:[[1]],expected:[1]},{input:[[1,2]],expected:[2]}],solution:`function middleNode(arr) {
  function buildList(a) {
    let head = null, tail = null;
    for (const v of a) {
      const node = { val: v, next: null };
      if (!head) head = tail = node; else { tail.next = node; tail = node; }
    }
    return head;
  }
  function toArray(h) {
    const out = [];
    let cur = h;
    while (cur) { out.push(cur.val); cur = cur.next; }
    return out;
  }
  const head = buildList(arr);
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return toArray(slow);
}`,solutions:[{approach:`Fast-Slow Pointers`,timeComplexity:`O(n)`,spaceComplexity:`O(1) extra`,explanation:`Advance a slow pointer one node at a time and a fast pointer two nodes at a time. When fast reaches the end, slow is exactly at the middle — one traversal, no need to know the length in advance.`,code:`function middleNode(arr) {
  function buildList(a) {
    let head = null, tail = null;
    for (const v of a) {
      const node = { val: v, next: null };
      if (!head) head = tail = node; else { tail.next = node; tail = node; }
    }
    return head;
  }
  function toArray(h) {
    const out = [];
    let cur = h;
    while (cur) { out.push(cur.val); cur = cur.next; }
    return out;
  }
  const head = buildList(arr);
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return toArray(slow);
}`},{approach:`Two-pass — count then walk`,timeComplexity:`O(n)`,spaceComplexity:`O(n)`,explanation:`First pass collects every node into an array (or just counts the length), then a second step jumps straight to the middle index. Needs the whole list materialized (or a length precomputed) before it can locate the middle, where fast-slow finds it in a single pass over the live list.`,code:`function middleNode(arr) {
  function buildList(a) {
    let head = null, tail = null;
    for (const v of a) {
      const node = { val: v, next: null };
      if (!head) head = tail = node; else { tail.next = node; tail = node; }
    }
    return head;
  }
  function toArray(h) {
    const out = [];
    let cur = h;
    while (cur) { out.push(cur.val); cur = cur.next; }
    return out;
  }
  const head = buildList(arr);
  const nodes = [];
  let cur = head;
  while (cur) { nodes.push(cur); cur = cur.next; }
  return toArray(nodes[Math.floor(nodes.length / 2)]);
}`}]}]},{id:`linked-list-cycle-detection`,name:`Cycle Detection`,explanation:`A special case of fast-slow pointers: if the fast pointer ever catches up to the slow one, the list loops back on itself. If fast reaches a null next pointer instead, there's no cycle.`,problems:[{id:`linked-list-has-cycle`,title:`Linked List Cycle Detection`,difficulty:`Easy`,description:`Given a linked list built from an array of values where the last node's next pointer connects back to index pos (or pos = -1 for no cycle), return true if the list has a cycle.`,fnName:`hasCycle`,starterCode:`function hasCycle(arr, pos) {
  // your code here
}`,testCases:[{input:[[3,2,0,-4],1],expected:!0},{input:[[1,2],0],expected:!0},{input:[[1],-1],expected:!1},{input:[[1,2,3],-1],expected:!1}],solution:`function hasCycle(arr, pos) {
  const nodes = arr.map((v) => ({ val: v, next: null }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length) nodes[nodes.length - 1].next = nodes[pos];
  let slow = nodes[0], fast = nodes[0];
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,solutions:[{approach:`Floyd's Fast-Slow Pointers`,timeComplexity:`O(n)`,spaceComplexity:`O(1)`,explanation:`If a cycle exists, a pointer moving 2 steps at a time is guaranteed to lap a pointer moving 1 step at a time and land on the same node. No extra memory — just two pointers racing around the list.`,code:`function hasCycle(arr, pos) {
  const nodes = arr.map((v) => ({ val: v, next: null }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length) nodes[nodes.length - 1].next = nodes[pos];
  let slow = nodes[0], fast = nodes[0];
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`},{approach:`Hash Set of visited nodes`,timeComplexity:`O(n)`,spaceComplexity:`O(n)`,explanation:`Walk the list, remembering every node visited. A cycle exists exactly when the walk revisits a node already in the set. Just as fast, but trades Floyd's constant space for a full extra set of node references.`,code:`function hasCycle(arr, pos) {
  const nodes = arr.map((v) => ({ val: v, next: null }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length) nodes[nodes.length - 1].next = nodes[pos];
  const seen = new Set();
  let cur = nodes[0];
  while (cur) { if (seen.has(cur)) return true; seen.add(cur); cur = cur.next; }
  return false;
}`}]}]},{id:`linked-list-reversal`,name:`Reversal`,explanation:`Flip every node's next pointer to point at the previous node instead of the following one, tracking prev/cur/next as you go (or achieving the same flip via recursion, unwinding from the tail).`,problems:[{id:`linked-list-reverse-list`,title:`Reverse Linked List`,difficulty:`Easy`,description:`Given the values of a singly linked list as an array, return the values of the reversed list.`,fnName:`reverseList`,starterCode:`function reverseList(arr) {
  // your code here
}`,testCases:[{input:[[1,2,3,4,5]],expected:[5,4,3,2,1]},{input:[[1,2]],expected:[2,1]},{input:[[1]],expected:[1]},{input:[[]],expected:[]}],solution:`function reverseList(arr) {
  function buildList(a) {
    let head = null, tail = null;
    for (const v of a) {
      const node = { val: v, next: null };
      if (!head) head = tail = node; else { tail.next = node; tail = node; }
    }
    return head;
  }
  function toArray(h) {
    const out = [];
    let cur = h;
    while (cur) { out.push(cur.val); cur = cur.next; }
    return out;
  }
  let cur = buildList(arr);
  let prev = null;
  while (cur) { const next = cur.next; cur.next = prev; prev = cur; cur = next; }
  return toArray(prev);
}`,solutions:[{approach:`Iterative pointer rewiring`,timeComplexity:`O(n)`,spaceComplexity:`O(1) extra`,explanation:`Walk the list once, and at each node flip its next pointer to point backward at the previous node instead of forward. Three running pointers (prev, cur, next) are all the extra state needed.`,code:`function reverseList(arr) {
  function buildList(a) {
    let head = null, tail = null;
    for (const v of a) {
      const node = { val: v, next: null };
      if (!head) head = tail = node; else { tail.next = node; tail = node; }
    }
    return head;
  }
  function toArray(h) {
    const out = [];
    let cur = h;
    while (cur) { out.push(cur.val); cur = cur.next; }
    return out;
  }
  let cur = buildList(arr);
  let prev = null;
  while (cur) { const next = cur.next; cur.next = prev; prev = cur; cur = next; }
  return toArray(prev);
}`},{approach:`Recursive reversal`,timeComplexity:`O(n)`,spaceComplexity:`O(n) — recursion stack, one frame per node`,explanation:`Recurse to the end of the list first, then, unwinding, make each node's next node point back at it. Same pointer-flipping idea as the iterative version, but the call stack does the bookkeeping instead of explicit prev/cur/next variables.`,code:`function reverseList(arr) {
  function buildList(a) {
    let head = null, tail = null;
    for (const v of a) {
      const node = { val: v, next: null };
      if (!head) head = tail = node; else { tail.next = node; tail = node; }
    }
    return head;
  }
  function toArray(h) {
    const out = [];
    let cur = h;
    while (cur) { out.push(cur.val); cur = cur.next; }
    return out;
  }
  function helper(node) {
    if (!node || !node.next) return node;
    const newHead = helper(node.next);
    node.next.next = node;
    node.next = null;
    return newHead;
  }
  return toArray(helper(buildList(arr)));
}`}]}]},{id:`linked-list-merge-lists`,name:`Merge Lists`,explanation:`Walk two already-sorted lists together with one pointer each, always splicing the smaller current node onto the result — no need to sort anything, since the inputs' order is never violated.`,problems:[{id:`linked-list-merge-two-sorted-lists`,title:`Merge Two Sorted Lists`,difficulty:`Easy`,description:`Given two sorted linked lists (as arrays of values), merge them into one sorted list and return its values as an array.`,fnName:`mergeTwoLists`,starterCode:`function mergeTwoLists(a, b) {
  // your code here
}`,testCases:[{input:[[1,2,4],[1,3,4]],expected:[1,1,2,3,4,4]},{input:[[],[]],expected:[]},{input:[[],[0]],expected:[0]},{input:[[5],[1,2,4]],expected:[1,2,4,5]}],solution:`function mergeTwoLists(a, b) {
  function buildList(arr) {
    let head = null, tail = null;
    for (const v of arr) {
      const node = { val: v, next: null };
      if (!head) head = tail = node; else { tail.next = node; tail = node; }
    }
    return head;
  }
  function toArray(h) {
    const out = [];
    let cur = h;
    while (cur) { out.push(cur.val); cur = cur.next; }
    return out;
  }
  let p1 = buildList(a), p2 = buildList(b);
  const dummy = { val: 0, next: null };
  let tail = dummy;
  while (p1 && p2) {
    if (p1.val <= p2.val) { tail.next = p1; p1 = p1.next; } else { tail.next = p2; p2 = p2.next; }
    tail = tail.next;
  }
  tail.next = p1 || p2;
  return toArray(dummy.next);
}`,solutions:[{approach:`Two-Pointer Merge`,timeComplexity:`O(n + m)`,spaceComplexity:`O(1) extra`,explanation:`Walk both lists simultaneously, always splicing the smaller current node onto the result and advancing that list's pointer. A dummy head node avoids special-casing the first splice. Once one list is exhausted, the remainder of the other is already sorted, so it's spliced on directly.`,code:`function mergeTwoLists(a, b) {
  function buildList(arr) {
    let head = null, tail = null;
    for (const v of arr) {
      const node = { val: v, next: null };
      if (!head) head = tail = node; else { tail.next = node; tail = node; }
    }
    return head;
  }
  function toArray(h) {
    const out = [];
    let cur = h;
    while (cur) { out.push(cur.val); cur = cur.next; }
    return out;
  }
  let p1 = buildList(a), p2 = buildList(b);
  const dummy = { val: 0, next: null };
  let tail = dummy;
  while (p1 && p2) {
    if (p1.val <= p2.val) { tail.next = p1; p1 = p1.next; } else { tail.next = p2; p2 = p2.next; }
    tail = tail.next;
  }
  tail.next = p1 || p2;
  return toArray(dummy.next);
}`},{approach:`Concatenate + sort`,timeComplexity:`O((n + m) log(n + m))`,spaceComplexity:`O(n + m)`,explanation:`Ignore that both inputs are already sorted — just concatenate them into one array and sort from scratch. Correct, but throws away the sortedness the two-pointer merge exploits to do the same job in linear time.`,code:`function mergeTwoLists(a, b) {
  return [...a, ...b].sort((x, y) => x - y);
}`}]}]}]},h=`Trees are given as level-order arrays with null for missing children (e.g. [3,9,20,null,null,15,7]), the same format LeetCode uses. Each solution below rebuilds real {val,left,right} node objects internally and operates on them with genuine pointer traversal — the array is only the wire format for test I/O.`,g=[l,u,d,f,p,m,{id:`trees`,name:`Trees`,subpatterns:[{id:`trees-traversal`,name:`Traversal`,explanation:`Visit every node exactly once, in an order that suits the question being asked — breadth-first level by level for shortest-path-style questions, or depth-first for questions about subtree shape.`,problems:[{id:`trees-level-order-traversal`,title:`Binary Tree Level Order Traversal`,difficulty:`Medium`,description:`Given a binary tree (level-order array with null gaps), return its values grouped by depth level, top to bottom, left to right within each level. ${h}`,fnName:`levelOrder`,starterCode:`function levelOrder(arr) {
  
}`,testCases:[{input:[[3,9,20,null,null,15,7]],expected:[[3],[9,20],[15,7]]},{input:[[1]],expected:[[1]]},{input:[[]],expected:[]},{input:[[1,2,3,4,null,null,5]],expected:[[1],[2,3],[4,5]]}],solution:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function levelOrder(arr) {
  const root = buildTree(arr);
  if (!root) return [];
  const result = [];
  let queue = [root];
  while (queue.length) {
    const level = [];
    const next = [];
    for (const node of queue) {
      level.push(node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    result.push(level);
    queue = next;
  }
  return result;
}`,solutions:[{approach:`Iterative BFS with a queue`,timeComplexity:`O(n)`,spaceComplexity:`O(n) — the queue can hold a full level's worth of nodes`,explanation:`Process the tree one level at a time: snapshot the current queue as 'this level', collect every child into a fresh queue for the next pass, and record each level's values before moving on.`,code:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function levelOrder(arr) {
  const root = buildTree(arr);
  if (!root) return [];
  const result = [];
  let queue = [root];
  while (queue.length) {
    const level = [];
    const next = [];
    for (const node of queue) {
      level.push(node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    result.push(level);
    queue = next;
  }
  return result;
}`},{approach:`Recursive DFS, bucketed by depth`,timeComplexity:`O(n)`,spaceComplexity:`O(n) for the result plus O(h) recursion stack (tree height h)`,explanation:`Depth-first walk the tree while tracking the current depth, pushing each node's value into the result bucket for that depth (creating the bucket on first visit). No queue needed at all.`,code:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function levelOrder(arr) {
  const root = buildTree(arr);
  const result = [];
  function dfs(node, depth) {
    if (!node) return;
    if (!result[depth]) result[depth] = [];
    result[depth].push(node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 0);
  return result;
}`}]}]},{id:`trees-bst`,name:`BST`,explanation:`A binary search tree keeps every left descendant smaller and every right descendant larger than the current node, which turns search, insert, and validity checks into O(h) operations.`,problems:[{id:`trees-validate-bst`,title:`Validate Binary Search Tree`,difficulty:`Medium`,description:`Given a binary tree (level-order array with null gaps), determine whether it is a valid binary search tree: every node's value must be strictly greater than all values in its left subtree and strictly less than all values in its right subtree. ${h}`,fnName:`isValidBST`,starterCode:`function isValidBST(arr) {
  
}`,testCases:[{input:[[2,1,3]],expected:!0},{input:[[5,1,4,null,null,3,6]],expected:!1},{input:[[1,1]],expected:!1},{input:[[3,1,5,0,2,4,6]],expected:!0},{input:[[]],expected:!0}],solution:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function isValidBST(arr) {
  const root = buildTree(arr);
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  for (let i = 1; i < vals.length; i++) if (vals[i] <= vals[i - 1]) return false;
  return true;
}`,solutions:[{approach:`Inorder traversal must be strictly increasing`,timeComplexity:`O(n)`,spaceComplexity:`O(n) — stores every value from the inorder walk`,explanation:`A BST's inorder traversal visits values in sorted order if and only if the tree is valid. Collect the inorder sequence, then check it's strictly increasing.`,code:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function isValidBST(arr) {
  const root = buildTree(arr);
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  for (let i = 1; i < vals.length; i++) if (vals[i] <= vals[i - 1]) return false;
  return true;
}`},{approach:`Recursive min/max bounds`,timeComplexity:`O(n)`,spaceComplexity:`O(h) recursion stack only — no extra array (tree height h)`,explanation:`Pass down a valid (lo, hi) range as you descend: a node must fall strictly inside its inherited range, and it narrows the range further for each subtree. No values need to be stored.`,code:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function isValidBST(arr) {
  const root = buildTree(arr);
  function helper(node, lo, hi) {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return helper(node.left, lo, node.val) && helper(node.right, node.val, hi);
  }
  return helper(root, -Infinity, Infinity);
}`}]}]},{id:`trees-lowest-common-ancestor`,name:`Lowest Common Ancestor`,explanation:`Find the deepest node that is an ancestor of two given nodes — the point where their paths back to the root first converge.`,problems:[{id:`trees-lowest-common-ancestor`,title:`Lowest Common Ancestor of a Binary Tree`,difficulty:`Medium`,description:`Given a binary tree (level-order array with null gaps) and two values p and q known to exist in the tree, return the value of their lowest common ancestor — the deepest node that has both p and q as descendants (a node can be its own descendant). ${h}`,fnName:`lowestCommonAncestor`,starterCode:`function lowestCommonAncestor(arr, p, q) {
  
}`,testCases:[{input:[[3,5,1,6,2,0,8,null,null,7,4],5,1],expected:3},{input:[[3,5,1,6,2,0,8,null,null,7,4],5,4],expected:5},{input:[[1,2],1,2],expected:1}],solution:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function lowestCommonAncestor(arr, p, q) {
  const root = buildTree(arr);
  function find(node) {
    if (!node) return null;
    if (node.val === p || node.val === q) return node;
    const left = find(node.left);
    const right = find(node.right);
    if (left && right) return node;
    return left || right;
  }
  const res = find(root);
  return res ? res.val : null;
}`,solutions:[{approach:`Recursive single-pass search`,timeComplexity:`O(n)`,spaceComplexity:`O(h) recursion stack (tree height h)`,explanation:`Recurse into both subtrees. If a call returns a hit from both sides, the current node is the LCA; otherwise bubble up whichever side (if any) found something.`,code:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function lowestCommonAncestor(arr, p, q) {
  const root = buildTree(arr);
  function find(node) {
    if (!node) return null;
    if (node.val === p || node.val === q) return node;
    const left = find(node.left);
    const right = find(node.right);
    if (left && right) return node;
    return left || right;
  }
  const res = find(root);
  return res ? res.val : null;
}`},{approach:`Iterative parent pointers + ancestor set`,timeComplexity:`O(n)`,spaceComplexity:`O(n) — stores a parent pointer for every node in the tree`,explanation:`Walk the whole tree once (iteratively, with a stack) recording each node's parent. Then walk p's ancestor chain into a set, and walk q's ancestor chain until it hits something already in that set.`,code:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function lowestCommonAncestor(arr, p, q) {
  const root = buildTree(arr);
  const parent = new Map();
  const stack = [root];
  parent.set(root, null);
  let pNode = null, qNode = null;
  while (stack.length) {
    const node = stack.pop();
    if (node.val === p) pNode = node;
    if (node.val === q) qNode = node;
    if (node.left) { parent.set(node.left, node); stack.push(node.left); }
    if (node.right) { parent.set(node.right, node); stack.push(node.right); }
  }
  const ancestors = new Set();
  let cur = pNode;
  while (cur) { ancestors.add(cur); cur = parent.get(cur); }
  cur = qNode;
  while (cur && !ancestors.has(cur)) cur = parent.get(cur);
  return cur ? cur.val : null;
}`}]}]},{id:`trees-construction`,name:`Construction`,explanation:`Rebuild a tree from other representations, such as a pair of traversal orders — each traversal type constrains the shape differently, and combining two is usually enough to pin it down uniquely.`,problems:[{id:`trees-construct-from-preorder-inorder`,title:`Construct Binary Tree from Preorder and Inorder Traversal`,difficulty:`Medium`,description:`Given a tree's preorder and inorder traversal arrays (values assumed unique), rebuild the tree and return it as a level-order array with null gaps — the same format used elsewhere in this pattern. Preorder gives root-first ordering; inorder tells you, for any subtree, which values fall to the left of its root and which fall to the right.`,fnName:`buildTreeFromTraversals`,starterCode:`function buildTreeFromTraversals(preorder, inorder) {
  
}`,testCases:[{input:[[3,9,20,15,7],[9,3,15,20,7]],expected:[3,9,20,null,null,15,7]},{input:[[-1],[-1]],expected:[-1]},{input:[[1,2,3],[3,2,1]],expected:[1,2,null,3]}],solution:`function serialize(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) { result.push(node.val); queue.push(node.left); queue.push(node.right); }
    else { result.push(null); }
  }
  while (result.length && result[result.length - 1] === null) result.pop();
  return result;
}
function buildTreeFromTraversals(preorder, inorder) {
  const indexMap = new Map();
  inorder.forEach((v, i) => indexMap.set(v, i));
  let preIdx = 0;
  function build(inLo, inHi) {
    if (inLo > inHi) return null;
    const rootVal = preorder[preIdx++];
    const node = { val: rootVal, left: null, right: null };
    const mid = indexMap.get(rootVal);
    node.left = build(inLo, mid - 1);
    node.right = build(mid + 1, inHi);
    return node;
  }
  return serialize(build(0, inorder.length - 1));
}`,solutions:[{approach:`Hashmap-indexed recursion`,timeComplexity:`O(n)`,spaceComplexity:`O(n) — the index map plus the recursion stack`,explanation:`Precompute each inorder value's index in a map so the root's split point is an O(1) lookup instead of a scan. Preorder is consumed left to right as root values; inorder bounds shrink each recursive call.`,code:`function serialize(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) { result.push(node.val); queue.push(node.left); queue.push(node.right); }
    else { result.push(null); }
  }
  while (result.length && result[result.length - 1] === null) result.pop();
  return result;
}
function buildTreeFromTraversals(preorder, inorder) {
  const indexMap = new Map();
  inorder.forEach((v, i) => indexMap.set(v, i));
  let preIdx = 0;
  function build(inLo, inHi) {
    if (inLo > inHi) return null;
    const rootVal = preorder[preIdx++];
    const node = { val: rootVal, left: null, right: null };
    const mid = indexMap.get(rootVal);
    node.left = build(inLo, mid - 1);
    node.right = build(mid + 1, inHi);
    return node;
  }
  return serialize(build(0, inorder.length - 1));
}`},{approach:`Naive indexOf + slice recursion`,timeComplexity:`O(n²)`,spaceComplexity:`O(n²) — each recursive level slices a fresh subarray`,explanation:`Instead of precomputing indices, scan for the root's position with indexOf and slice the inorder array into left/right halves on every call. Correct, but the repeated scans and array copies add up.`,code:`function serialize(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) { result.push(node.val); queue.push(node.left); queue.push(node.right); }
    else { result.push(null); }
  }
  while (result.length && result[result.length - 1] === null) result.pop();
  return result;
}
function buildTreeFromTraversals(preorder, inorder) {
  let preIdx = 0;
  function build(inSub) {
    if (!inSub.length) return null;
    const rootVal = preorder[preIdx++];
    const node = { val: rootVal, left: null, right: null };
    const mid = inSub.indexOf(rootVal);
    node.left = build(inSub.slice(0, mid));
    node.right = build(inSub.slice(mid + 1));
    return node;
  }
  return serialize(build(inorder));
}`}]}]}]},{id:`recursion`,name:`Recursion`,subpatterns:[{id:`recursion-backtracking`,name:`Backtracking`,explanation:`Explore a decision tree by choosing, recursing, then undoing the choice ('backtracking') to try the next option — useful whenever you need every valid combination, permutation, or arrangement.`,problems:[{id:`recursion-subsets`,title:`Subsets`,difficulty:`Medium`,description:`Given an array of distinct integers, return every possible subset (the power set), including the empty set and the full array itself. Order of subsets and order of elements within a subset don't matter.`,fnName:`subsets`,starterCode:`function subsets(nums) {
  
}`,testCases:[{input:[[1,2,3]],expected:[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]},{input:[[0]],expected:[[],[0]]},{input:[[]],expected:[[]]},{input:[[1,2]],expected:[[],[1],[2],[1,2]]}],normalize:e=>Array.isArray(e)?e.map(e=>Array.isArray(e)?[...e].sort((e,t)=>e-t):e).sort((e,t)=>JSON.stringify(e).localeCompare(JSON.stringify(t))):e,solution:`function subsets(nums) {
  const result = [];
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,solutions:[{approach:`Backtracking (DFS include/exclude)`,timeComplexity:`O(n·2ⁿ)`,spaceComplexity:`O(n) extra — recursion depth plus the path buffer (not counting output)`,explanation:`At each index, either it's in the current subset or it isn't. Record the path so far as a subset on every call, recurse further with each remaining element added, then backtrack by removing it.`,code:`function subsets(nums) {
  const result = [];
  function backtrack(start, path) {
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}`},{approach:`Iterative bitmask enumeration`,timeComplexity:`O(n·2ⁿ)`,spaceComplexity:`O(1) extra — no recursion, just a counter and an inner loop (not counting output)`,explanation:`Every subset corresponds to one n-bit number: bit i set means nums[i] is included. Count from 0 to 2ⁿ-1 and read off each mask's bits to build that subset — no recursion needed at all.`,code:`function subsets(nums) {
  const n = nums.length;
  const result = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) subset.push(nums[i]);
    result.push(subset);
  }
  return result;
}`}]}]},{id:`recursion-divide-and-conquer`,name:`Divide & Conquer`,explanation:`Split a problem into independent subproblems, solve each recursively, then combine their results — the combine step is what separates this from plain recursion.`,problems:[{id:`recursion-merge-sort`,title:`Sort an Array (Merge Sort)`,difficulty:`Medium`,description:`Given an array of integers, return it sorted in ascending order, without relying on a built-in sort.`,fnName:`mergeSortArray`,starterCode:`function mergeSortArray(nums) {
  
}`,testCases:[{input:[[5,2,4,1,3]],expected:[1,2,3,4,5]},{input:[[]],expected:[]},{input:[[1]],expected:[1]},{input:[[3,3,1,2]],expected:[1,2,3,3]},{input:[[-5,0,5,-3]],expected:[-5,-3,0,5]}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`}],returns:{kind:`intArray`}},solution:`function mergeSortArray(nums) {
  if (nums.length <= 1) return nums.slice();
  const mid = Math.floor(nums.length / 2);
  const left = mergeSortArray(nums.slice(0, mid));
  const right = mergeSortArray(nums.slice(mid));
  const merged = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) merged.push(left[i++]); else merged.push(right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}`,solutions:[{approach:`Merge sort (divide & conquer)`,timeComplexity:`O(n log n)`,spaceComplexity:`O(n) — merged output buffers at every level`,explanation:`Split the array in half, recursively sort each half, then merge the two sorted halves with a single linear pass. The split always happens in the middle, so recursion depth is log n.`,code:`function mergeSortArray(nums) {
  if (nums.length <= 1) return nums.slice();
  const mid = Math.floor(nums.length / 2);
  const left = mergeSortArray(nums.slice(0, mid));
  const right = mergeSortArray(nums.slice(mid));
  const merged = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) merged.push(left[i++]); else merged.push(right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}`},{approach:`Insertion sort (brute force)`,timeComplexity:`O(n²)`,spaceComplexity:`O(1) extra — sorts in place aside from the initial copy`,explanation:`Grow a sorted prefix one element at a time: take the next element and shift it leftward past every already-sorted element bigger than it. Simple, but quadratic on average and worst case.`,code:`function mergeSortArray(nums) {
  const arr = nums.slice();
  for (let i = 1; i < arr.length; i++) {
    let j = i, cur = arr[i];
    while (j > 0 && arr[j - 1] > cur) { arr[j] = arr[j - 1]; j--; }
    arr[j] = cur;
  }
  return arr;
}`}]}]},{id:`recursion-tree-graph-recursion`,name:`Tree/Graph Recursion`,explanation:`Recursion mirrors a tree's or graph's own recursive structure: a node's answer is defined in terms of its children's answers, with the base case being an empty (null) node.`,problems:[{id:`recursion-max-depth`,title:`Maximum Depth of Binary Tree`,difficulty:`Easy`,description:`Given a binary tree (level-order array with null gaps), return its maximum depth — the number of nodes along the longest path from the root down to the farthest leaf.`,fnName:`maxDepth`,starterCode:`function maxDepth(arr) {
  
}`,testCases:[{input:[[3,9,20,null,null,15,7]],expected:3},{input:[[1,null,2]],expected:2},{input:[[]],expected:0},{input:[[1]],expected:1}],solution:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function maxDepth(arr) {
  const root = buildTree(arr);
  function depth(node) { return node ? 1 + Math.max(depth(node.left), depth(node.right)) : 0; }
  return depth(root);
}`,solutions:[{approach:`Recursive DFS`,timeComplexity:`O(n)`,spaceComplexity:`O(h) recursion stack (tree height h)`,explanation:`A subtree's depth is 1 plus the deeper of its two children's depths. An empty tree has depth 0 — the base case that makes the recursion bottom out.`,code:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function maxDepth(arr) {
  const root = buildTree(arr);
  function depth(node) { return node ? 1 + Math.max(depth(node.left), depth(node.right)) : 0; }
  return depth(root);
}`},{approach:`Iterative BFS, counting levels`,timeComplexity:`O(n)`,spaceComplexity:`O(n) — the queue can hold a full level's worth of nodes`,explanation:`Process the tree level by level with a queue, incrementing a counter once per level. The final count, once the queue empties, is the depth.`,code:`function buildTree(arr) {
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
    }
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}
function maxDepth(arr) {
  const root = buildTree(arr);
  if (!root) return 0;
  let d = 0;
  let queue = [root];
  while (queue.length) {
    d++;
    const next = [];
    for (const node of queue) { if (node.left) next.push(node.left); if (node.right) next.push(node.right); }
    queue = next;
  }
  return d;
}`}]}]},{id:`recursion-memoization`,name:`Memoization`,explanation:`Cache the result of each unique recursive call so overlapping subproblems are computed once instead of repeatedly — the fix for recursion trees that revisit the same inputs exponentially often.`,problems:[{id:`recursion-fibonacci`,title:`Fibonacci Number`,difficulty:`Easy`,description:`Given n, return the n-th Fibonacci number (fib(0) = 0, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2)).`,fnName:`fib`,starterCode:`function fib(n) {
  
}`,testCases:[{input:[0],expected:0},{input:[1],expected:1},{input:[5],expected:5},{input:[10],expected:55},{input:[15],expected:610}],cSignature:{params:[{kind:`int`,name:`n`}],returns:{kind:`int`}},solution:`function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,solutions:[{approach:`Naive recursion`,timeComplexity:`O(2ⁿ)`,spaceComplexity:`O(n) recursion stack`,explanation:`Directly translate the recurrence into code. Correct, but fib(k) gets recomputed from scratch every time it's needed by a different branch — the call tree's size explodes exponentially.`,code:`function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`},{approach:`Top-down memoization`,timeComplexity:`O(n)`,spaceComplexity:`O(n) — memo table plus recursion stack`,explanation:`Same recursive structure, but cache each fib(k) the first time it's computed. Every subsequent call for that k is an O(1) lookup instead of a re-derivation, collapsing the exponential blowup.`,code:`function fib(n) {
  const memo = new Map();
  function helper(k) {
    if (k <= 1) return k;
    if (memo.has(k)) return memo.get(k);
    const result = helper(k - 1) + helper(k - 2);
    memo.set(k, result);
    return result;
  }
  return helper(n);
}`}]}]}]},{id:`heap`,name:`Heap`,subpatterns:[{id:`heap-priority-queue`,name:`Priority Queue`,explanation:`A heap is the classic backing structure for a priority queue: the highest (or lowest) priority item always sits at the root, reachable in O(1), while insert and remove stay logarithmic.`,problems:[{id:`heap-priority-queue-design`,title:`Design a Priority Queue (Min)`,difficulty:`Medium`,description:`Design a min-priority-queue supporting insert, extractMin, and peek, exercised via a sequence of operations. ops[i] is one of "insert", "extractMin", "peek"; argsList[i] holds that operation's arguments (empty except for insert). insert returns null; extractMin/peek return -1 when the queue is empty.`,fnName:`priorityQueueOperations`,starterCode:`function priorityQueueOperations(ops, argsList) {
  // your code here
}`,testCases:[{input:[[`insert`,`insert`,`insert`,`peek`,`extractMin`,`extractMin`,`peek`,`insert`,`extractMin`,`extractMin`,`extractMin`],[[5],[2],[8],[],[],[],[],[1],[],[],[]]],expected:[null,null,null,2,2,5,8,null,1,8,-1]},{input:[[`extractMin`,`peek`,`insert`,`peek`],[[],[],[4],[]]],expected:[-1,-1,null,4]}],solution:`function priorityQueueOperations(ops, argsList) {
  const heap = [];
  function siftUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent] <= heap[i]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  }
  function siftDown(i) {
    const n = heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && heap[l] < heap[smallest]) smallest = l;
      if (r < n && heap[r] < heap[smallest]) smallest = r;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
      i = smallest;
    }
  }
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'insert') {
      heap.push(a[0]);
      siftUp(heap.length - 1);
      out.push(null);
    } else if (op === 'extractMin') {
      if (!heap.length) { out.push(-1); continue; }
      const min = heap[0];
      const last = heap.pop();
      if (heap.length) { heap[0] = last; siftDown(0); }
      out.push(min);
    } else if (op === 'peek') {
      out.push(heap.length ? heap[0] : -1);
    }
  }
  return out;
}`,solutions:[{approach:`Binary heap (array-backed)`,timeComplexity:`O(log n) insert/extractMin, O(1) peek`,spaceComplexity:`O(n)`,explanation:`Store the heap as an array where each node's children live at 2i+1 and 2i+2. Insert appends then sifts up; extractMin swaps the root with the last element, pops, then sifts the new root down.`,code:`function priorityQueueOperations(ops, argsList) {
  const heap = [];
  function siftUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent] <= heap[i]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  }
  function siftDown(i) {
    const n = heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && heap[l] < heap[smallest]) smallest = l;
      if (r < n && heap[r] < heap[smallest]) smallest = r;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
      i = smallest;
    }
  }
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'insert') {
      heap.push(a[0]);
      siftUp(heap.length - 1);
      out.push(null);
    } else if (op === 'extractMin') {
      if (!heap.length) { out.push(-1); continue; }
      const min = heap[0];
      const last = heap.pop();
      if (heap.length) { heap[0] = last; siftDown(0); }
      out.push(min);
    } else if (op === 'peek') {
      out.push(heap.length ? heap[0] : -1);
    }
  }
  return out;
}`},{approach:`Unsorted array (brute force)`,timeComplexity:`O(1) insert, O(n) extractMin/peek`,spaceComplexity:`O(n)`,explanation:`Just append on insert — no ordering maintained. extractMin and peek have to linearly rescan the whole array every time to find the current minimum, since nothing is kept sorted.`,code:`function priorityQueueOperations(ops, argsList) {
  const arr = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'insert') { arr.push(a[0]); out.push(null); }
    else if (op === 'extractMin') {
      if (!arr.length) { out.push(-1); continue; }
      let minIdx = 0;
      for (let j = 1; j < arr.length; j++) if (arr[j] < arr[minIdx]) minIdx = j;
      out.push(arr.splice(minIdx, 1)[0]);
    } else if (op === 'peek') {
      if (!arr.length) { out.push(-1); continue; }
      out.push(Math.min(...arr));
    }
  }
  return out;
}`}]}]},{id:`heap-top-k`,name:`Top-K`,explanation:`To find the k largest (or smallest) items among n without sorting everything, maintain a heap of size k — it tracks exactly the elements that currently qualify, discarding the rest as it goes.`,problems:[{id:`heap-kth-largest`,title:`Kth Largest Element in an Array`,difficulty:`Medium`,description:`Given an unsorted array of integers and an integer k, return the k-th largest element (not the k-th distinct element — duplicates count separately).`,fnName:`findKthLargest`,starterCode:`function findKthLargest(nums, k) {
  
}`,testCases:[{input:[[3,2,1,5,6,4],2],expected:5},{input:[[3,2,3,1,2,4,5,5,6],4],expected:4},{input:[[1],1],expected:1},{input:[[7,6,5,4,3,2,1],3],expected:5}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`int`,name:`k`}],returns:{kind:`int`}},solution:`function findKthLargest(nums, k) {
  const heap = [];
  function siftUp(i) {
    while (i > 0) { const p = (i - 1) >> 1; if (heap[p] <= heap[i]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
  }
  function siftDown(i) {
    const n = heap.length;
    while (true) {
      let smallest = i; const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && heap[l] < heap[smallest]) smallest = l;
      if (r < n && heap[r] < heap[smallest]) smallest = r;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]]; i = smallest;
    }
  }
  for (const num of nums) {
    heap.push(num); siftUp(heap.length - 1);
    if (heap.length > k) { heap[0] = heap.pop(); siftDown(0); }
  }
  return heap[0];
}`,solutions:[{approach:`Min-heap of size k`,timeComplexity:`O(n log k)`,spaceComplexity:`O(k)`,explanation:`Keep a min-heap capped at size k. Push every number; whenever the heap grows past k, pop the smallest. What survives is exactly the k largest values, and the heap's root is the smallest of those.`,code:`function findKthLargest(nums, k) {
  const heap = [];
  function siftUp(i) {
    while (i > 0) { const p = (i - 1) >> 1; if (heap[p] <= heap[i]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
  }
  function siftDown(i) {
    const n = heap.length;
    while (true) {
      let smallest = i; const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && heap[l] < heap[smallest]) smallest = l;
      if (r < n && heap[r] < heap[smallest]) smallest = r;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]]; i = smallest;
    }
  }
  for (const num of nums) {
    heap.push(num); siftUp(heap.length - 1);
    if (heap.length > k) { heap[0] = heap.pop(); siftDown(0); }
  }
  return heap[0];
}`},{approach:`Full sort (brute force)`,timeComplexity:`O(n log n)`,spaceComplexity:`O(n)`,explanation:`Sort a copy of the array descending and read off index k-1. Simple, but does far more work than needed when k is small.`,code:`function findKthLargest(nums, k) {
  const sorted = [...nums].sort((a, b) => b - a);
  return sorted[k - 1];
}`}]}]},{id:`heap-heapify-heap-sort`,name:`Heapify/Heap Sort`,explanation:`Heapify turns an arbitrary array into heap order in linear time by sifting down from the last non-leaf node backward. Heap sort reuses that structure to sort in place in O(n log n).`,problems:[{id:`heap-heap-sort`,title:`Sort an Array (Heap Sort)`,difficulty:`Medium`,description:`Given an array of integers, return it sorted in ascending order using heap sort: heapify the array into a max-heap, then repeatedly swap the root (the current maximum) to the end and shrink the heap.`,fnName:`heapSortArray`,starterCode:`function heapSortArray(nums) {
  
}`,testCases:[{input:[[5,2,4,1,3]],expected:[1,2,3,4,5]},{input:[[]],expected:[]},{input:[[1]],expected:[1]},{input:[[3,3,1,2]],expected:[1,2,3,3]},{input:[[-5,0,5,-3]],expected:[-5,-3,0,5]}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`}],returns:{kind:`intArray`}},solution:`function heapSortArray(nums) {
  const arr = nums.slice();
  const n = arr.length;
  function siftDown(i, size) {
    while (true) {
      let largest = i; const l = 2 * i + 1, r = 2 * i + 2;
      if (l < size && arr[l] > arr[largest]) largest = l;
      if (r < size && arr[r] > arr[largest]) largest = r;
      if (largest === i) break;
      [arr[largest], arr[i]] = [arr[i], arr[largest]]; i = largest;
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(i, n);
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    siftDown(0, end);
  }
  return arr;
}`,solutions:[{approach:`Heap sort (heapify + repeated extraction)`,timeComplexity:`O(n log n)`,spaceComplexity:`O(1) extra — sorts in place aside from the initial copy`,explanation:`Heapify the whole array into a max-heap in O(n), then repeatedly swap the root (the max of the remaining unsorted region) to the end of that region and sift the new root down.`,code:`function heapSortArray(nums) {
  const arr = nums.slice();
  const n = arr.length;
  function siftDown(i, size) {
    while (true) {
      let largest = i; const l = 2 * i + 1, r = 2 * i + 2;
      if (l < size && arr[l] > arr[largest]) largest = l;
      if (r < size && arr[r] > arr[largest]) largest = r;
      if (largest === i) break;
      [arr[largest], arr[i]] = [arr[i], arr[largest]]; i = largest;
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(i, n);
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    siftDown(0, end);
  }
  return arr;
}`},{approach:`Selection sort (brute force)`,timeComplexity:`O(n²)`,spaceComplexity:`O(1) extra — sorts in place aside from the initial copy`,explanation:`Repeatedly scan the unsorted remainder for its minimum and swap it into place. No heap structure — just a plain linear scan per position.`,code:`function heapSortArray(nums) {
  const arr = nums.slice();
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) if (arr[j] < arr[minIdx]) minIdx = j;
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`}]}]}]},{id:`graphs`,name:`Graphs`,subpatterns:[{id:`graphs-bfs`,name:`BFS`,explanation:`Breadth-first search explores a graph one distance-layer at a time via a queue, which makes it the natural tool for shortest-path questions on unweighted graphs.`,problems:[{id:`graphs-shortest-path-bfs`,title:`Shortest Path in an Unweighted Graph`,difficulty:`Medium`,description:`Given n nodes (0 to n-1), a list of undirected edges [u, v], and a source node, return an array where index i holds the number of edges on the shortest path from source to node i, or -1 if i is unreachable.`,fnName:`shortestPathBFS`,starterCode:`function shortestPathBFS(n, edges, source) {
  
}`,testCases:[{input:[6,[[0,1],[0,2],[1,3],[2,3],[3,4]],0],expected:[0,1,1,2,3,-1]},{input:[1,[],0],expected:[0]},{input:[4,[[0,1],[1,2],[2,3]],0],expected:[0,1,2,3]},{input:[3,[[0,1]],2],expected:[-1,-1,0]}],solution:`function shortestPathBFS(n, edges, source) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const dist = new Array(n).fill(-1);
  dist[source] = 0;
  const queue = [source];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    for (const next of adj[node]) {
      if (dist[next] === -1) { dist[next] = dist[node] + 1; queue.push(next); }
    }
  }
  return dist;
}`,solutions:[{approach:`BFS`,timeComplexity:`O(V + E)`,spaceComplexity:`O(V)`,explanation:`BFS explores nodes in order of distance from the source, since it visits everything at distance d before anything at distance d+1. Each node is enqueued once, so a distance is only ever set the first (shortest) time it's reached.`,code:`function shortestPathBFS(n, edges, source) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const dist = new Array(n).fill(-1);
  dist[source] = 0;
  const queue = [source];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    for (const next of adj[node]) {
      if (dist[next] === -1) { dist[next] = dist[node] + 1; queue.push(next); }
    }
  }
  return dist;
}`},{approach:`Bellman-Ford-style relaxation (brute force)`,timeComplexity:`O(V · E)`,spaceComplexity:`O(V)`,explanation:`Treat every edge as weight 1 and relax all edges repeatedly (up to V-1 passes, stopping early if a full pass changes nothing). Correct for unweighted shortest paths, but does far more work than BFS since it re-examines every edge on every pass instead of only the newly-discovered frontier.`,code:`function shortestPathBFS(n, edges, source) {
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;
  for (let iter = 0; iter < n - 1; iter++) {
    let changed = false;
    for (const [u, v] of edges) {
      if (dist[u] + 1 < dist[v]) { dist[v] = dist[u] + 1; changed = true; }
      if (dist[v] + 1 < dist[u]) { dist[u] = dist[v] + 1; changed = true; }
    }
    if (!changed) break;
  }
  return dist.map((d) => (d === Infinity ? -1 : d));
}`}]}]},{id:`graphs-dfs`,name:`DFS`,explanation:`Depth-first search commits to one path as deep as it goes before backtracking, which makes it a natural fit for questions about reachability, connectivity, and structure (cycles, components).`,problems:[{id:`graphs-connected-components`,title:`Number of Connected Components in an Undirected Graph`,difficulty:`Medium`,description:`Given n nodes (0 to n-1) and a list of undirected edges [u, v], return the number of connected components.`,fnName:`countComponents`,starterCode:`function countComponents(n, edges) {
  
}`,testCases:[{input:[5,[[0,1],[1,2],[3,4]]],expected:2},{input:[5,[[0,1],[1,2],[2,3],[3,4]]],expected:1},{input:[1,[]],expected:1},{input:[4,[]],expected:4}],solution:`function countComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const visited = new Array(n).fill(false);
  let count = 0;
  function dfs(node) {
    visited[node] = true;
    for (const next of adj[node]) if (!visited[next]) dfs(next);
  }
  for (let i = 0; i < n; i++) if (!visited[i]) { count++; dfs(i); }
  return count;
}`,solutions:[{approach:`DFS from every unvisited node`,timeComplexity:`O(V + E)`,spaceComplexity:`O(V) — visited array plus recursion stack`,explanation:`Each time a DFS starting from an unvisited node finishes, everything it touched forms one component. Count how many times a fresh DFS has to be launched.`,code:`function countComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const visited = new Array(n).fill(false);
  let count = 0;
  function dfs(node) {
    visited[node] = true;
    for (const next of adj[node]) if (!visited[next]) dfs(next);
  }
  for (let i = 0; i < n; i++) if (!visited[i]) { count++; dfs(i); }
  return count;
}`},{approach:`Union-Find (disjoint set)`,timeComplexity:`O(E · α(V)) — α is the inverse Ackermann function, effectively constant`,spaceComplexity:`O(V) — the parent array`,explanation:`Union every edge's two endpoints into the same set, using path compression to keep find() nearly O(1). The number of distinct roots left at the end is the number of components.`,code:`function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  function union(a, b) { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; }
  for (const [u, v] of edges) union(u, v);
  const roots = new Set();
  for (let i = 0; i < n; i++) roots.add(find(i));
  return roots.size;
}`}]}]},{id:`graphs-dijkstra`,name:`Dijkstra`,explanation:`For weighted graphs with non-negative edges, Dijkstra's algorithm always finalizes the currently- closest unfinished node next, guaranteeing each node's shortest distance is locked in the moment it's popped from the priority queue.`,problems:[{id:`graphs-network-delay-time`,title:`Network Delay Time`,difficulty:`Medium`,description:`n nodes (1 to n) receive a signal sent from node k, propagating along directed weighted edges times[i] = [u, v, w] (w = travel time from u to v). Return the time for every node to receive the signal (the max over all shortest distances from k), or -1 if some node is unreachable.`,fnName:`networkDelayTime`,starterCode:`function networkDelayTime(times, n, k) {
  
}`,testCases:[{input:[[[2,1,1],[2,3,1],[3,4,1]],4,2],expected:2},{input:[[[1,2,1]],2,1],expected:1},{input:[[[1,2,1]],2,2],expected:-1},{input:[[[1,2,1],[2,3,2],[1,3,4]],3,1],expected:3}],solution:`function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const heap = [[0, k]];
  function siftUp(i) {
    while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
  }
  function siftDown(i) {
    const size = heap.length;
    while (true) {
      let smallest = i; const l = 2 * i + 1, r = 2 * i + 2;
      if (l < size && heap[l][0] < heap[smallest][0]) smallest = l;
      if (r < size && heap[r][0] < heap[smallest][0]) smallest = r;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]]; i = smallest;
    }
  }
  while (heap.length) {
    const [d, node] = heap[0];
    const last = heap.pop();
    if (heap.length) { heap[0] = last; siftDown(0); }
    if (d > dist[node]) continue;
    for (const [next, w] of adj[node]) {
      const nd = d + w;
      if (nd < dist[next]) { dist[next] = nd; heap.push([nd, next]); siftUp(heap.length - 1); }
    }
  }
  let maxD = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    maxD = Math.max(maxD, dist[i]);
  }
  return maxD;
}`,solutions:[{approach:`Dijkstra with a min-heap`,timeComplexity:`O((V + E) log V)`,spaceComplexity:`O(V + E) — adjacency list plus the heap`,explanation:`Always expand the closest not-yet-finalized node next. A min-heap keyed on current best distance makes 'closest next' an O(log V) operation instead of a linear scan, and stale heap entries (a node reached again at a worse distance) are just skipped when popped.`,code:`function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const heap = [[0, k]];
  function siftUp(i) {
    while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
  }
  function siftDown(i) {
    const size = heap.length;
    while (true) {
      let smallest = i; const l = 2 * i + 1, r = 2 * i + 2;
      if (l < size && heap[l][0] < heap[smallest][0]) smallest = l;
      if (r < size && heap[r][0] < heap[smallest][0]) smallest = r;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]]; i = smallest;
    }
  }
  while (heap.length) {
    const [d, node] = heap[0];
    const last = heap.pop();
    if (heap.length) { heap[0] = last; siftDown(0); }
    if (d > dist[node]) continue;
    for (const [next, w] of adj[node]) {
      const nd = d + w;
      if (nd < dist[next]) { dist[next] = nd; heap.push([nd, next]); siftUp(heap.length - 1); }
    }
  }
  let maxD = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    maxD = Math.max(maxD, dist[i]);
  }
  return maxD;
}`},{approach:`Bellman-Ford (brute force)`,timeComplexity:`O(V · E)`,spaceComplexity:`O(V) — just the distance array, no heap or adjacency list needed`,explanation:`Relax every edge, up to V-1 times over. No priority ordering at all — correct because after V-1 full passes, every shortest path (which has at most V-1 edges) is guaranteed to have been found.`,code:`function networkDelayTime(times, n, k) {
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  for (let i = 0; i < n - 1; i++) {
    let changed = false;
    for (const [u, v, w] of times) {
      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }
    }
    if (!changed) break;
  }
  let maxD = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    maxD = Math.max(maxD, dist[i]);
  }
  return maxD;
}`}]}]},{id:`graphs-topological-sort`,name:`Topological Sort`,explanation:`For a directed acyclic graph, a topological order lists every node so that each edge points from earlier to later in the list — only possible at all when the graph has no cycle.`,problems:[{id:`graphs-course-schedule`,title:`Course Schedule`,difficulty:`Medium`,description:`Given numCourses (0 to numCourses-1) and prerequisites[i] = [course, pre] meaning 'course' requires 'pre' to be taken first, return whether it's possible to finish all courses (equivalently: does the prerequisite graph contain a cycle?).`,fnName:`canFinishCourses`,starterCode:`function canFinishCourses(numCourses, prerequisites) {
  
}`,testCases:[{input:[2,[[1,0]]],expected:!0},{input:[2,[[1,0],[0,1]]],expected:!1},{input:[4,[[1,0],[2,0],[3,1],[3,2]]],expected:!0},{input:[1,[]],expected:!0},{input:[3,[[0,1],[1,2],[2,0]]],expected:!1}],solution:`function canFinishCourses(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) { adj[pre].push(course); indegree[course]++; }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) queue.push(i);
  let visited = 0;
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    visited++;
    for (const next of adj[node]) { indegree[next]--; if (indegree[next] === 0) queue.push(next); }
  }
  return visited === numCourses;
}`,solutions:[{approach:`Kahn's algorithm (BFS topological sort)`,timeComplexity:`O(V + E)`,spaceComplexity:`O(V) — in-degree array plus the queue`,explanation:`Repeatedly peel off nodes with no remaining unmet prerequisites (in-degree 0), decrementing their neighbors' in-degrees as they're removed. If every node eventually gets peeled off, there's no cycle — a cycle's nodes always have an in-degree stuck above 0.`,code:`function canFinishCourses(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) { adj[pre].push(course); indegree[course]++; }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) queue.push(i);
  let visited = 0;
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    visited++;
    for (const next of adj[node]) { indegree[next]--; if (indegree[next] === 0) queue.push(next); }
  }
  return visited === numCourses;
}`},{approach:`DFS with 3-color cycle detection`,timeComplexity:`O(V + E)`,spaceComplexity:`O(V) — the color array plus recursion stack`,explanation:`Mark each node unvisited (0), in-progress (1), or done (2). A DFS that reaches a node already marked in-progress has found a back edge — a cycle. Only marking done once all its descendants are fully explored is what makes this distinct from just tracking a plain visited set.`,code:`function canFinishCourses(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) adj[pre].push(course);
  const state = new Array(numCourses).fill(0);
  function hasCycle(node) {
    if (state[node] === 1) return true;
    if (state[node] === 2) return false;
    state[node] = 1;
    for (const next of adj[node]) if (hasCycle(next)) return true;
    state[node] = 2;
    return false;
  }
  for (let i = 0; i < numCourses; i++) if (hasCycle(i)) return false;
  return true;
}`}]}]}]},{id:`trie`,name:`Trie`,subpatterns:[{id:`trie-insert-search`,name:`Insert/Search`,explanation:`A trie stores strings character by character along shared paths from the root, so every word with the same prefix reuses the same nodes — insert, search, and prefix checks all cost just O(word length).`,problems:[{id:`trie-design-trie`,title:`Design a Trie (Prefix Tree)`,difficulty:`Medium`,description:`Design a trie supporting insert, search (exact word match), and startsWith (prefix match), exercised via a sequence of operations. ops[i] is one of "insert", "search", "startsWith"; argsList[i] holds that operation's single-word argument. insert returns null; search/startsWith return a boolean.`,fnName:`trieOperations`,starterCode:`function trieOperations(ops, argsList) {
  // your code here
}`,testCases:[{input:[[`insert`,`search`,`search`,`startsWith`,`insert`,`search`,`startsWith`],[[`apple`],[`apple`],[`app`],[`app`],[`app`],[`app`],[``]]],expected:[null,!0,!1,!0,null,!0,!0]},{input:[[`search`,`startsWith`],[[`cat`],[`c`]]],expected:[!1,!1]}],solution:`function trieOperations(ops, argsList) {
  const root = {};
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'insert') {
      let node = root;
      for (const ch of a[0]) { if (!node[ch]) node[ch] = {}; node = node[ch]; }
      node.isEnd = true;
      out.push(null);
    } else if (op === 'search') {
      let node = root;
      for (const ch of a[0]) { if (!node[ch]) { node = null; break; } node = node[ch]; }
      out.push(!!(node && node.isEnd));
    } else if (op === 'startsWith') {
      let node = root;
      for (const ch of a[0]) { if (!node[ch]) { node = null; break; } node = node[ch]; }
      out.push(!!node);
    }
  }
  return out;
}`,solutions:[{approach:`Real trie (nested character nodes)`,timeComplexity:`O(m) per operation (m = word length)`,spaceComplexity:`O(total characters inserted)`,explanation:`Each node is a plain object keyed by the next character, with a boolean marking word ends. Insert and lookups both just walk one character at a time from the root — no scanning of other words needed.`,code:`function trieOperations(ops, argsList) {
  const root = {};
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'insert') {
      let node = root;
      for (const ch of a[0]) { if (!node[ch]) node[ch] = {}; node = node[ch]; }
      node.isEnd = true;
      out.push(null);
    } else if (op === 'search') {
      let node = root;
      for (const ch of a[0]) { if (!node[ch]) { node = null; break; } node = node[ch]; }
      out.push(!!(node && node.isEnd));
    } else if (op === 'startsWith') {
      let node = root;
      for (const ch of a[0]) { if (!node[ch]) { node = null; break; } node = node[ch]; }
      out.push(!!node);
    }
  }
  return out;
}`},{approach:`Flat word list (brute force)`,timeComplexity:`O(n · m) per search/startsWith (n = words stored, m = word length)`,spaceComplexity:`O(total characters inserted)`,explanation:`Just push every inserted word into an array. search checks for an exact match anywhere in the array; startsWith checks whether any stored word begins with the query — both have to look at every stored word in the worst case, unlike the trie's direct character-path walk.`,code:`function trieOperations(ops, argsList) {
  const words = [];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'insert') { words.push(a[0]); out.push(null); }
    else if (op === 'search') { out.push(words.includes(a[0])); }
    else if (op === 'startsWith') { out.push(words.some((w) => w.startsWith(a[0]))); }
  }
  return out;
}`}]}]},{id:`trie-prefix-problems`,name:`Prefix Problems`,explanation:`Any question about what strings share in common at the start is really a question about how far down a shared trie path goes before branching.`,problems:[{id:`trie-longest-common-prefix`,title:`Longest Common Prefix`,difficulty:`Easy`,description:`Given an array of strings, return the longest prefix common to all of them, or an empty string if there isn't one.`,fnName:`longestCommonPrefix`,starterCode:`function longestCommonPrefix(strs) {
  
}`,testCases:[{input:[[`flower`,`flow`,`flight`]],expected:`fl`},{input:[[`dog`,`racecar`,`car`]],expected:``},{input:[[`a`]],expected:`a`},{input:[[]],expected:``},{input:[[`ab`,`a`]],expected:`a`}],cSignature:{params:[{kind:`stringArray`,name:`strs`,sizeName:`strsSize`}],returns:{kind:`string`}},solution:`function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return '';
    }
  }
  return prefix;
}`,solutions:[{approach:`Shrink-to-fit scanning`,timeComplexity:`O(S) (S = total characters across all strings)`,spaceComplexity:`O(1) extra`,explanation:`Start assuming the whole first string is the common prefix, then shrink it one character at a time until every remaining string actually starts with it. Each character is trimmed at most once overall.`,code:`function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return '';
    }
  }
  return prefix;
}`},{approach:`Trie-based common-prefix walk`,timeComplexity:`O(S) (S = total characters across all strings)`,spaceComplexity:`O(S) — builds a full trie of every string first`,explanation:`Insert every string into a trie, with each node tracking how many inserted strings pass through it. Walk down from the root while there's exactly one child and that child's count equals the total string count — the moment either fails, the shared prefix has ended.`,code:`function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  const root = { children: new Map(), count: strs.length };
  for (const s of strs) {
    let node = root;
    for (const ch of s) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), count: 0 });
      node = node.children.get(ch);
      node.count++;
    }
  }
  let prefix = '';
  let node = root;
  while (node.children.size === 1) {
    const [ch, child] = [...node.children.entries()][0];
    if (child.count !== strs.length) break;
    prefix += ch;
    node = child;
  }
  return prefix;
}`}]}]},{id:`trie-word-break`,name:`Word Break`,explanation:`Segmenting a string into dictionary words is a search over split points — a trie (or a hash set, for smaller dictionaries) makes checking 'is this piece a word' fast at every candidate split.`,problems:[{id:`trie-word-break`,title:`Word Break`,difficulty:`Medium`,description:`Given a string s and an array of dictionary words wordDict, return whether s can be segmented into a space-separated sequence of one or more dictionary words (words may be reused any number of times).`,fnName:`wordBreak`,starterCode:`function wordBreak(s, wordDict) {
  
}`,testCases:[{input:[`leetcode`,[`leet`,`code`]],expected:!0},{input:[`applepenapple`,[`apple`,`pen`]],expected:!0},{input:[`catsandog`,[`cats`,`dog`,`sand`,`and`,`cat`]],expected:!1},{input:[`a`,[`b`]],expected:!1},{input:[``,[]],expected:!0}],cSignature:{params:[{kind:`string`,name:`s`},{kind:`stringArray`,name:`wordDict`,sizeName:`wordDictSize`}],returns:{kind:`bool`}},solution:`function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[n];
}`,solutions:[{approach:`Dynamic programming`,timeComplexity:`O(n³) worst case (O(n²) substring endpoints, each an O(n) slice)`,spaceComplexity:`O(n) — the dp array plus the word set`,explanation:`dp[i] means 's up to index i can be segmented'. It's true if some earlier split point j has dp[j] true and the piece between j and i is a dictionary word — every split point is tried once, and results are never recomputed.`,code:`function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[n];
}`},{approach:`Naive recursive backtracking (no memoization)`,timeComplexity:`O(2ⁿ) worst case`,spaceComplexity:`O(n) recursion stack`,explanation:`Try every dictionary word as the next piece from the current position and recurse. Correct, but with no memo the same starting position gets re-explored from scratch by every path that reaches it, and the number of paths grows exponentially with the string length.`,code:`function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  function helper(start) {
    if (start === s.length) return true;
    for (let end = start + 1; end <= s.length; end++) {
      if (words.has(s.slice(start, end)) && helper(end)) return true;
    }
    return false;
  }
  return helper(0);
}`}]}]}]},{id:`dynamic-programming`,name:`Dynamic Programming`,subpatterns:[{id:`dynamic-programming-1d`,name:`1D`,explanation:`A single index sweep where each state depends on a fixed number of earlier states — the whole dp array often collapses down to just a couple of running variables.`,problems:[{id:`dp-house-robber`,title:`House Robber`,difficulty:`Medium`,description:`Given an array of non-negative integers representing money stashed in houses along a street, return the maximum amount you can rob without robbing two adjacent houses.`,fnName:`rob`,starterCode:`function rob(nums) {
  
}`,testCases:[{input:[[1,2,3,1]],expected:4},{input:[[2,7,9,3,1]],expected:12},{input:[[]],expected:0},{input:[[5]],expected:5},{input:[[2,1,1,2]],expected:4}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`}],returns:{kind:`int`}},solution:`function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const cur = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,solutions:[{approach:`Bottom-up DP, O(1) space`,timeComplexity:`O(n)`,spaceComplexity:`O(1) — just two running totals`,explanation:`At each house, the best you can do is either skip it (carry forward the best total up to the previous house) or rob it (its value plus the best total from two houses back). Only the last two running totals are ever needed, so the whole dp array collapses to two variables.`,code:`function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const cur = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`},{approach:`Naive recursion (no memoization)`,timeComplexity:`O(2ⁿ) worst case`,spaceComplexity:`O(n) recursion stack`,explanation:`Same rob-or-skip recurrence, but computed top-down with no cache — the same house index gets re-explored from multiple call paths, and the redundant work doubles with every extra house.`,code:`function rob(nums) {
  function helper(i) {
    if (i < 0) return 0;
    if (i === 0) return nums[0];
    return Math.max(helper(i - 1), helper(i - 2) + nums[i]);
  }
  return nums.length ? helper(nums.length - 1) : 0;
}`}]}]},{id:`dynamic-programming-2d`,name:`2D`,explanation:`Two indices moving together — usually two sequences being compared or two dimensions of a grid — so the state is naturally a table, and each cell is filled from a small set of neighboring cells.`,problems:[{id:`dp-longest-common-subsequence`,title:`Longest Common Subsequence`,difficulty:`Medium`,description:`Given two strings text1 and text2, return the length of their longest common subsequence (characters in the same relative order, not necessarily contiguous), or 0 if they share none.`,fnName:`longestCommonSubsequence`,starterCode:`function longestCommonSubsequence(text1, text2) {
  
}`,testCases:[{input:[`abcde`,`ace`],expected:3},{input:[`abc`,`abc`],expected:3},{input:[`abc`,`def`],expected:0},{input:[``,`abc`],expected:0},{input:[`abc`,``],expected:0}],cSignature:{params:[{kind:`string`,name:`text1`},{kind:`string`,name:`text2`}],returns:{kind:`int`}},solution:`function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`,solutions:[{approach:`2D dynamic programming`,timeComplexity:`O(m · n)`,spaceComplexity:`O(m · n) — the full grid`,explanation:`dp[i][j] holds the LCS length of the first i characters of text1 and first j of text2. Matching characters extend the diagonal's answer by one; otherwise the best of dropping a character from either string carries forward — every cell is filled exactly once.`,code:`function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`},{approach:`Naive recursion (no memoization)`,timeComplexity:`O(2^(m+n)) worst case`,spaceComplexity:`O(m + n) recursion stack`,explanation:`Same match/skip recurrence explored top-down with no cache — the same (i, j) pair gets recomputed from many different call paths, so work grows exponentially with the combined string length.`,code:`function longestCommonSubsequence(text1, text2) {
  function helper(i, j) {
    if (i === text1.length || j === text2.length) return 0;
    if (text1[i] === text2[j]) return 1 + helper(i + 1, j + 1);
    return Math.max(helper(i + 1, j), helper(i, j + 1));
  }
  return helper(0, 0);
}`}]}]},{id:`dynamic-programming-knapsack`,name:`Knapsack`,explanation:`Choosing a subset of items under a capacity constraint. The state is (items considered, capacity used so far), and each item is either skipped or taken — the classic take/skip DP shape.`,problems:[{id:`dp-knapsack`,title:`0/1 Knapsack`,difficulty:`Medium`,description:`Given item weights, item values, and a knapsack capacity, return the maximum total value obtainable by choosing a subset of items (each usable at most once) whose total weight doesn't exceed the capacity.`,fnName:`knapsack`,starterCode:`function knapsack(weights, values, capacity) {
  
}`,testCases:[{input:[[1,3,4,5],[1,4,5,7],7],expected:9},{input:[[2,3,4,5],[3,4,5,6],5],expected:7},{input:[[1,2,3],[6,10,12],5],expected:22},{input:[[5],[10],4],expected:0},{input:[[],[],10],expected:0}],cSignature:{params:[{kind:`intArray`,name:`weights`,sizeName:`weightsSize`},{kind:`intArray`,name:`values`,sizeName:`valuesSize`},{kind:`int`,name:`capacity`}],returns:{kind:`int`}},solution:`function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      }
    }
  }
  return dp[n][capacity];
}`,solutions:[{approach:`2D dynamic programming`,timeComplexity:`O(n · capacity)`,spaceComplexity:`O(n · capacity) — the full grid`,explanation:`dp[i][w] is the best value achievable using the first i items within weight w. Each item is either left out (carry forward dp[i-1][w]) or taken (its value plus the best from the remaining capacity) — every (item, weight) combination is resolved exactly once.`,code:`function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      }
    }
  }
  return dp[n][capacity];
}`},{approach:`Naive recursion (no memoization)`,timeComplexity:`O(2ⁿ) worst case`,spaceComplexity:`O(n) recursion stack`,explanation:`Same take/skip recurrence explored top-down with no cache — the same (item index, remaining capacity) state is recomputed from every path that reaches it, so the branching factor of two per item makes the work exponential in the number of items.`,code:`function knapsack(weights, values, capacity) {
  function helper(i, remaining) {
    if (i === weights.length || remaining === 0) return 0;
    if (weights[i] > remaining) return helper(i + 1, remaining);
    return Math.max(helper(i + 1, remaining), values[i] + helper(i + 1, remaining - weights[i]));
  }
  return helper(0, capacity);
}`}]}]},{id:`dynamic-programming-dp-on-trees`,name:`DP on Trees`,explanation:`The state now lives at each tree node instead of an array index, and children must be resolved before their parent — a post-order traversal that returns a small summary per node (rather than one flat table) is the natural way to avoid recomputation.`,problems:[{id:`dp-house-robber-tree`,title:`House Robber III`,difficulty:`Medium`,description:`Houses in a neighborhood form a binary tree (given as a level-order array with null for missing children). Directly-connected houses (parent and child) can't both be robbed. Return the maximum total that can be robbed.`,fnName:`robTree`,starterCode:`function robTree(arr) {
  
}`,testCases:[{input:[[3,2,3,null,3,null,1]],expected:7},{input:[[3,4,5,1,3,null,1]],expected:9},{input:[[]],expected:0},{input:[[5]],expected:5},{input:[[4,1,null,2,null,3]],expected:7}],solution:`function robTree(arr) {
  function buildTree(a) {
    if (!a.length || a[0] === null) return null;
    const root = { val: a[0], left: null, right: null };
    const queue = [root];
    let i = 1;
    while (queue.length && i < a.length) {
      const node = queue.shift();
      if (i < a.length) {
        const leftVal = a[i++];
        if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
      }
      if (i < a.length) {
        const rightVal = a[i++];
        if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
      }
    }
    return root;
  }
  const root = buildTree(arr);
  function helper(node) {
    if (!node) return [0, 0];
    const left = helper(node.left);
    const right = helper(node.right);
    const notRobbed = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
    const robbed = node.val + left[0] + right[0];
    return [notRobbed, robbed];
  }
  const [notRobbed, robbed] = helper(root);
  return Math.max(notRobbed, robbed);
}`,solutions:[{approach:`Post-order DP returning a (skip, take) pair`,timeComplexity:`O(n)`,spaceComplexity:`O(h) recursion stack (h = tree height)`,explanation:`Each node reports two numbers to its parent: the best total if this node is NOT robbed, and the best total if it IS robbed. A parent that robs itself can only use its children's 'not robbed' totals; a parent that doesn't rob itself takes the better of each child's two options. Every node is visited exactly once.`,code:`function robTree(arr) {
  function buildTree(a) {
    if (!a.length || a[0] === null) return null;
    const root = { val: a[0], left: null, right: null };
    const queue = [root];
    let i = 1;
    while (queue.length && i < a.length) {
      const node = queue.shift();
      if (i < a.length) {
        const leftVal = a[i++];
        if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
      }
      if (i < a.length) {
        const rightVal = a[i++];
        if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
      }
    }
    return root;
  }
  const root = buildTree(arr);
  function helper(node) {
    if (!node) return [0, 0];
    const left = helper(node.left);
    const right = helper(node.right);
    const notRobbed = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
    const robbed = node.val + left[0] + right[0];
    return [notRobbed, robbed];
  }
  const [notRobbed, robbed] = helper(root);
  return Math.max(notRobbed, robbed);
}`},{approach:`Naive recursion (no memoization)`,timeComplexity:`O(2ʰ) worst case (h = tree height) — grandchildren subtrees get recomputed`,spaceComplexity:`O(h) recursion stack`,explanation:`Each node independently recomputes 'rob this node' (which needs its grandchildren, not just its children) versus 'don't rob this node' (which recurses into both children fresh) — the same subtrees get walked repeatedly instead of being resolved once and reused, unlike the pair-returning version.`,code:`function robTree(arr) {
  function buildTree(a) {
    if (!a.length || a[0] === null) return null;
    const root = { val: a[0], left: null, right: null };
    const queue = [root];
    let i = 1;
    while (queue.length && i < a.length) {
      const node = queue.shift();
      if (i < a.length) {
        const leftVal = a[i++];
        if (leftVal !== null) { node.left = { val: leftVal, left: null, right: null }; queue.push(node.left); }
      }
      if (i < a.length) {
        const rightVal = a[i++];
        if (rightVal !== null) { node.right = { val: rightVal, left: null, right: null }; queue.push(node.right); }
      }
    }
    return root;
  }
  const root = buildTree(arr);
  function helper(node) {
    if (!node) return 0;
    let robThis = node.val;
    if (node.left) { robThis += helper(node.left.left) + helper(node.left.right); }
    if (node.right) { robThis += helper(node.right.left) + helper(node.right.right); }
    const notRobThis = helper(node.left) + helper(node.right);
    return Math.max(robThis, notRobThis);
  }
  return helper(root);
}`}]}]}]},{id:`greedy`,name:`Greedy`,subpatterns:[{id:`greedy-activity-selection`,name:`Activity Selection`,explanation:`Picking the maximum set of non-overlapping activities. Sorting by finish time and always taking the next compatible earliest-finishing activity is a textbook proof-by-exchange-argument greedy.`,problems:[{id:`greedy-activity-selection`,title:`Activity Selection`,difficulty:`Medium`,description:`Given a list of activities as [start, end] pairs, return the maximum number of non-overlapping activities that can be scheduled (touching endpoints, where one ends exactly when the next begins, don't count as overlapping).`,fnName:`activitySelection`,starterCode:`function activitySelection(activities) {
  
}`,testCases:[{input:[[[1,3],[2,4],[3,5]]],expected:2},{input:[[[1,2],[2,3],[3,4]]],expected:3},{input:[[]],expected:0},{input:[[[5,6]]],expected:1},{input:[[[1,10],[2,3],[4,5],[6,7]]],expected:3}],cSignature:{params:[{kind:`intMatrix`,name:`activities`,sizeName:`activitiesSize`,cols:2}],returns:{kind:`int`}},solution:`function activitySelection(activities) {
  const sorted = [...activities].sort((a, b) => a[1] - b[1]);
  let count = 0, lastEnd = -Infinity;
  for (const [s, e] of sorted) {
    if (s >= lastEnd) { count++; lastEnd = e; }
  }
  return count;
}`,solutions:[{approach:`Greedy: sort by end time`,timeComplexity:`O(n log n) — dominated by the sort`,spaceComplexity:`O(n) for the sorted copy`,explanation:`Always take the activity that finishes soonest among the ones still compatible with what's already picked — finishing early leaves the most room for everything after it, so a locally greedy choice turns out to be globally optimal here.`,code:`function activitySelection(activities) {
  const sorted = [...activities].sort((a, b) => a[1] - b[1]);
  let count = 0, lastEnd = -Infinity;
  for (const [s, e] of sorted) {
    if (s >= lastEnd) { count++; lastEnd = e; }
  }
  return count;
}`},{approach:`Brute-force include/exclude recursion`,timeComplexity:`O(2ⁿ) worst case`,spaceComplexity:`O(n) recursion stack`,explanation:`Try every activity as either taken or skipped and recurse, tracking the end time of the last taken activity. Correct because it explores every valid combination, but with no pruning or memoization the branching is exponential in the number of activities.`,code:`function activitySelection(activities) {
  const sorted = [...activities].sort((a, b) => a[0] - b[0]);
  function helper(i, lastEnd) {
    if (i === sorted.length) return 0;
    const skip = helper(i + 1, lastEnd);
    let take = 0;
    if (sorted[i][0] >= lastEnd) take = 1 + helper(i + 1, sorted[i][1]);
    return Math.max(skip, take);
  }
  return helper(0, -Infinity);
}`}]}]},{id:`greedy-interval-scheduling`,name:`Interval Scheduling`,explanation:`A broader family of interval problems — here, how many resources (rooms) are needed to host every interval at once. A sweep over sorted start/end boundaries greedily tracks concurrent demand.`,problems:[{id:`greedy-min-meeting-rooms`,title:`Meeting Rooms II`,difficulty:`Medium`,description:`Given meeting time intervals as [start, end] pairs, return the minimum number of conference rooms required so that no two overlapping meetings share a room.`,fnName:`minMeetingRooms`,starterCode:`function minMeetingRooms(intervals) {
  
}`,testCases:[{input:[[[0,30],[5,10],[15,20]]],expected:2},{input:[[[7,10],[2,4]]],expected:1},{input:[[]],expected:0},{input:[[[1,5],[1,5],[1,5]]],expected:3},{input:[[[1,10],[2,3],[4,5],[6,7]]],expected:2}],cSignature:{params:[{kind:`intMatrix`,name:`intervals`,sizeName:`intervalsSize`,cols:2}],returns:{kind:`int`}},solution:`function minMeetingRooms(intervals) {
  if (!intervals.length) return 0;
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);
  let rooms = 0, maxRooms = 0;
  let s = 0, e = 0;
  while (s < starts.length) {
    if (starts[s] < ends[e]) { rooms++; s++; } else { rooms--; e++; }
    maxRooms = Math.max(maxRooms, rooms);
  }
  return maxRooms;
}`,solutions:[{approach:`Two-pointer sweep over sorted starts/ends`,timeComplexity:`O(n log n) — dominated by the two sorts`,spaceComplexity:`O(n) for the sorted copies`,explanation:`Sort start times and end times separately, then sweep through the timeline: every start needs a new room unless an earlier meeting has already ended by that point. The running count's peak is the answer — greedily reusing the earliest-freed room never costs anything.`,code:`function minMeetingRooms(intervals) {
  if (!intervals.length) return 0;
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);
  let rooms = 0, maxRooms = 0;
  let s = 0, e = 0;
  while (s < starts.length) {
    if (starts[s] < ends[e]) { rooms++; s++; } else { rooms--; e++; }
    maxRooms = Math.max(maxRooms, rooms);
  }
  return maxRooms;
}`},{approach:`Room-assignment simulation`,timeComplexity:`O(n²) worst case — scans existing rooms for each meeting`,spaceComplexity:`O(n) for the room end-time list`,explanation:`Process meetings in start order and assign each one to the first room whose current meeting has already ended, opening a new room only if none are free. Correct, but checking every existing room for each new meeting is quadratic instead of the sweep's linear-after-sorting pass.`,code:`function minMeetingRooms(intervals) {
  if (!intervals.length) return 0;
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const roomEndTimes = [];
  for (const [s, e] of sorted) {
    let assigned = false;
    for (let i = 0; i < roomEndTimes.length; i++) {
      if (roomEndTimes[i] <= s) { roomEndTimes[i] = e; assigned = true; break; }
    }
    if (!assigned) roomEndTimes.push(e);
  }
  return roomEndTimes.length;
}`}]}]},{id:`greedy-huffman-coding`,name:`Huffman Coding`,explanation:`Building an optimal prefix code by always combining the two least-frequent symbols first — the canonical example of a greedy algorithm with a formal optimality proof, implemented with a min-heap.`,problems:[{id:`greedy-huffman-coding`,title:`Huffman Coding: Minimum Merge Cost`,difficulty:`Medium`,description:`Given the frequencies of a set of symbols, repeatedly merge the two least-frequent piles (cost = their sum) until one pile remains, and return the total cost of all merges — this is the weighted path length Huffman coding minimizes to build an optimal prefix code.`,fnName:`huffmanCost`,starterCode:`function huffmanCost(freqs) {
  
}`,testCases:[{input:[[5,9,12,13,16,45]],expected:224},{input:[[1,2,3]],expected:9},{input:[[]],expected:0},{input:[[7]],expected:0},{input:[[4,4]],expected:8}],cSignature:{params:[{kind:`intArray`,name:`freqs`,sizeName:`freqsSize`}],returns:{kind:`int`}},solution:`function huffmanCost(freqs) {
  if (freqs.length <= 1) return 0;
  const heap = [...freqs];
  function siftUp(i) {
    while (i > 0) { const p = (i - 1) >> 1; if (heap[p] <= heap[i]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
  }
  function siftDown(i) {
    const n = heap.length;
    while (true) {
      let smallest = i; const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && heap[l] < heap[smallest]) smallest = l;
      if (r < n && heap[r] < heap[smallest]) smallest = r;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]]; i = smallest;
    }
  }
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i);
  function extractMin() {
    const min = heap[0];
    const last = heap.pop();
    if (heap.length) { heap[0] = last; siftDown(0); }
    return min;
  }
  function insert(v) { heap.push(v); siftUp(heap.length - 1); }
  let totalCost = 0;
  while (heap.length > 1) {
    const a = extractMin();
    const b = extractMin();
    const combined = a + b;
    totalCost += combined;
    insert(combined);
  }
  return totalCost;
}`,solutions:[{approach:`Min-heap greedy merge`,timeComplexity:`O(n log n)`,spaceComplexity:`O(n) for the heap`,explanation:`Always merge the two smallest piles next — that's exactly the greedy choice Huffman's algorithm makes, and it's provably optimal because any pile merged later (deeper in the resulting tree) should be as small as possible. A binary heap keeps 'find the two smallest' cheap after every merge.`,code:`function huffmanCost(freqs) {
  if (freqs.length <= 1) return 0;
  const heap = [...freqs];
  function siftUp(i) {
    while (i > 0) { const p = (i - 1) >> 1; if (heap[p] <= heap[i]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
  }
  function siftDown(i) {
    const n = heap.length;
    while (true) {
      let smallest = i; const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && heap[l] < heap[smallest]) smallest = l;
      if (r < n && heap[r] < heap[smallest]) smallest = r;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]]; i = smallest;
    }
  }
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(i);
  function extractMin() {
    const min = heap[0];
    const last = heap.pop();
    if (heap.length) { heap[0] = last; siftDown(0); }
    return min;
  }
  function insert(v) { heap.push(v); siftUp(heap.length - 1); }
  let totalCost = 0;
  while (heap.length > 1) {
    const a = extractMin();
    const b = extractMin();
    const combined = a + b;
    totalCost += combined;
    insert(combined);
  }
  return totalCost;
}`},{approach:`Linear-scan merge (no heap)`,timeComplexity:`O(n²) — a full scan to find each of the two smallest piles per merge`,spaceComplexity:`O(n) for the working array`,explanation:`Same greedy merge-the-two-smallest strategy, but finds each smallest pile with a plain linear scan over the remaining array instead of a heap — correct, just slower to repeatedly locate the minimum as merges accumulate.`,code:`function huffmanCost(freqs) {
  const arr = [...freqs];
  if (arr.length <= 1) return 0;
  let totalCost = 0;
  while (arr.length > 1) {
    let i1 = 0;
    for (let i = 1; i < arr.length; i++) if (arr[i] < arr[i1]) i1 = i;
    const v1 = arr.splice(i1, 1)[0];
    let i2 = 0;
    for (let i = 1; i < arr.length; i++) if (arr[i] < arr[i2]) i2 = i;
    const v2 = arr.splice(i2, 1)[0];
    const combined = v1 + v2;
    totalCost += combined;
    arr.push(combined);
  }
  return totalCost;
}`}]}]}]},{id:`bit-manipulation`,name:`Bit Manipulation`,subpatterns:[{id:`bit-manipulation-basic-ops`,name:`Basic Ops`,explanation:`AND, OR, XOR, NOT, and shifts are the primitives everything else in this pattern is built from — here they're combined to reproduce addition itself, without the arithmetic operators that normally hide the bit-level work.`,problems:[{id:`bit-manipulation-sum-without-arithmetic`,title:`Sum of Two Integers Without + or -`,difficulty:`Medium`,description:`Given two integers a and b, return their sum without using the + or - operators — only bitwise operations are allowed.`,fnName:`getSum`,starterCode:`function getSum(a, b) {
  
}`,testCases:[{input:[2,3],expected:5},{input:[-2,3],expected:1},{input:[-1,1],expected:0},{input:[0,0],expected:0},{input:[100,200],expected:300}],cSignature:{params:[{kind:`int`,name:`a`},{kind:`int`,name:`b`}],returns:{kind:`int`}},solution:`function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,solutions:[{approach:`Iterative XOR/AND carry propagation`,timeComplexity:`O(1) — bounded by 32 bit positions`,spaceComplexity:`O(1) — no extra space`,explanation:`XOR adds two bits without carrying (1⊕1=0, dropping the carry); AND-then-shift-left computes exactly the carry that XOR dropped. Repeatedly folding that carry back in until there's nothing left to carry reproduces addition using only bitwise operators.`,code:`function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`},{approach:`Recursive XOR/AND carry propagation`,timeComplexity:`O(1) — bounded by 32 bit positions`,spaceComplexity:`O(32) worst-case recursion depth, bounded by bit width`,explanation:`The exact same carry-propagation identity, expressed as 'the sum of a and b is the sum of (a XOR b) and their shifted carry' — recursing until the carry reaches zero instead of looping.`,code:`function getSum(a, b) {
  if (b === 0) return a;
  const sum = a ^ b;
  const carry = (a & b) << 1;
  return getSum(sum, carry);
}`}]}]},{id:`bit-manipulation-counting-set-bits`,name:`Counting Set Bits`,explanation:`Counting how many 1 bits a number has shows up constantly as a subroutine — either directly via bit-clearing tricks, or built up with DP by reusing the popcount of a related, smaller number.`,problems:[{id:`bit-manipulation-counting-bits`,title:`Counting Bits`,difficulty:`Easy`,description:`Given a non-negative integer n, return an array of length n + 1 where the value at index i is the number of set bits (1s) in the binary representation of i.`,fnName:`countBits`,starterCode:`function countBits(n) {
  
}`,testCases:[{input:[5],expected:[0,1,1,2,1,2]},{input:[0],expected:[0]},{input:[2],expected:[0,1,1]},{input:[8],expected:[0,1,1,2,1,2,2,3,1]}],cSignature:{params:[{kind:`int`,name:`n`}],returns:{kind:`intArray`}},solution:`function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,solutions:[{approach:`DP built from the answer for i >> 1`,timeComplexity:`O(n)`,spaceComplexity:`O(n) for the output array`,explanation:`Dropping i's lowest bit (i >> 1) removes exactly one bit from its popcount — plus 1 back if that dropped bit was itself a 1 (i & 1). Since i >> 1 is always a smaller, already-computed index, each answer is built in O(1) from an earlier one instead of being recounted from scratch.`,code:`function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`},{approach:`Brian Kernighan's algorithm per number`,timeComplexity:`O(n · average popcount) — each number's set bits are stripped one at a time`,spaceComplexity:`O(n) for the output array`,explanation:`For every number from 0 to n independently, repeatedly clear the lowest set bit with x &= (x - 1) and count the clears — correct and still fast, but each number is recounted from nothing instead of reusing any earlier result.`,code:`function countBits(n) {
  const result = [];
  for (let i = 0; i <= n; i++) {
    let count = 0, x = i;
    while (x) { x &= (x - 1); count++; }
    result.push(count);
  }
  return result;
}`}]}]},{id:`bit-manipulation-xor-tricks`,name:`XOR Tricks`,explanation:`XOR's self-canceling property (x ^ x = 0, x ^ 0 = x) turns 'find the odd one out' problems into a single linear pass with no extra memory — one of the most reused tricks in bit manipulation.`,problems:[{id:`bit-manipulation-single-number`,title:`Single Number`,difficulty:`Easy`,description:`Given an array where every element appears exactly twice except for one which appears exactly once, return that single element.`,fnName:`singleNumber`,starterCode:`function singleNumber(nums) {
  
}`,testCases:[{input:[[2,2,1]],expected:1},{input:[[4,1,2,1,2]],expected:4},{input:[[1]],expected:1},{input:[[0,1,0]],expected:1},{input:[[5,3,5,3,7]],expected:7}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`}],returns:{kind:`int`}},solution:`function singleNumber(nums) {
  let result = 0;
  for (const n of nums) result ^= n;
  return result;
}`,solutions:[{approach:`XOR accumulation`,timeComplexity:`O(n)`,spaceComplexity:`O(1) — one accumulator`,explanation:`XOR is its own inverse and commutative/associative, so XOR-ing every element together cancels every pair to zero (x ^ x = 0) and leaves only the unpaired element — no extra memory needed to track what's been seen.`,code:`function singleNumber(nums) {
  let result = 0;
  for (const n of nums) result ^= n;
  return result;
}`},{approach:`Frequency map`,timeComplexity:`O(n)`,spaceComplexity:`O(n) for the frequency map`,explanation:`Count occurrences of every value in a hash map, then scan the map for the one entry with count 1. Correct and still linear time, but stores every distinct value instead of using the XOR cancellation trick that needs no extra memory at all.`,code:`function singleNumber(nums) {
  const counts = new Map();
  for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);
  for (const [k, v] of counts) if (v === 1) return k;
}`}]}]}]},{id:`advanced`,name:`Advanced`,subpatterns:[{id:`advanced-two-pointers`,name:`Two Pointers`,explanation:`Sorting first turns a search for combinations into a pair of pointers that can only move inward, collapsing an O(n²) or O(n³) search over combinations into something the pointers prune as they go.`,problems:[{id:`advanced-three-sum`,title:`3Sum`,difficulty:`Medium`,description:`Given an array of integers, return all unique triplets [a, b, c] such that a + b + c === 0. The order of triplets and of values within a triplet doesn't matter.`,fnName:`threeSum`,starterCode:`function threeSum(nums) {
  
}`,testCases:[{input:[[-1,0,1,2,-1,-4]],expected:[[-1,-1,2],[-1,0,1]]},{input:[[0,1,1]],expected:[]},{input:[[0,0,0]],expected:[[0,0,0]]},{input:[[]],expected:[]},{input:[[-2,0,1,1,2]],expected:[[-2,0,2],[-2,1,1]]}],normalize:e=>Array.isArray(e)?e.map(e=>Array.isArray(e)?[...e].sort((e,t)=>e-t):e).sort((e,t)=>JSON.stringify(e).localeCompare(JSON.stringify(t))):e,solution:`function threeSum(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    let lo = i + 1, hi = sorted.length - 1;
    while (lo < hi) {
      const sum = sorted[i] + sorted[lo] + sorted[hi];
      if (sum === 0) {
        result.push([sorted[i], sorted[lo], sorted[hi]]);
        while (lo < hi && sorted[lo] === sorted[lo + 1]) lo++;
        while (lo < hi && sorted[hi] === sorted[hi - 1]) hi--;
        lo++; hi--;
      } else if (sum < 0) lo++;
      else hi--;
    }
  }
  return result;
}`,solutions:[{approach:`Sort + two pointers per anchor`,timeComplexity:`O(n²)`,spaceComplexity:`O(n) for the sorted copy (excluding the output)`,explanation:`Sort once, then fix each element as an anchor and use two pointers closing in from both ends of the rest of the array to find pairs that complete the sum to zero — sorting also makes skipping duplicate anchors and duplicate pairs a simple adjacent-element check.`,code:`function threeSum(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    let lo = i + 1, hi = sorted.length - 1;
    while (lo < hi) {
      const sum = sorted[i] + sorted[lo] + sorted[hi];
      if (sum === 0) {
        result.push([sorted[i], sorted[lo], sorted[hi]]);
        while (lo < hi && sorted[lo] === sorted[lo + 1]) lo++;
        while (lo < hi && sorted[hi] === sorted[hi - 1]) hi--;
        lo++; hi--;
      } else if (sum < 0) lo++;
      else hi--;
    }
  }
  return result;
}`},{approach:`Brute-force triple loop`,timeComplexity:`O(n³)`,spaceComplexity:`O(n) for the dedup set (excluding the output)`,explanation:`Try every triple of indices directly and keep the ones that sum to zero, deduplicating by stringifying a sorted copy of each match. Straightforward, but checking every combination is an order of magnitude slower than pruning with sorted two pointers.`,code:`function threeSum(nums) {
  const n = nums.length;
  const seen = new Set();
  const result = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          const key = triplet.join(',');
          if (!seen.has(key)) { seen.add(key); result.push(triplet); }
        }
      }
    }
  }
  return result;
}`}]}]},{id:`advanced-meet-in-the-middle`,name:`Meet in the Middle`,explanation:`When the input is too large for full exponential search but still small enough to split in half, solving each half independently and then combining the two smaller results turns 2ⁿ into roughly 2 · 2^(n/2) — a huge win for moderate n.`,problems:[{id:`advanced-subset-sum-meet-in-the-middle`,title:`Subset Sum Exists`,difficulty:`Hard`,description:`Given an array of integers and a target, return whether any subset of the array sums exactly to the target.`,fnName:`subsetSumExists`,starterCode:`function subsetSumExists(nums, target) {
  
}`,testCases:[{input:[[3,34,4,12,5,2],9],expected:!0},{input:[[3,34,4,12,5,2],30],expected:!1},{input:[[],0],expected:!0},{input:[[5],5],expected:!0},{input:[[1,2,3,4,5,6,7,8],100],expected:!1}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`int`,name:`target`}],returns:{kind:`bool`}},solution:`function subsetSumExists(nums, target) {
  const n = nums.length;
  const mid = Math.floor(n / 2);
  const left = nums.slice(0, mid);
  const right = nums.slice(mid);
  function allSums(arr) {
    const sums = [0];
    for (const x of arr) {
      const len = sums.length;
      for (let i = 0; i < len; i++) sums.push(sums[i] + x);
    }
    return sums;
  }
  const leftSums = allSums(left);
  const rightSums = allSums(right).sort((a, b) => a - b);
  for (const ls of leftSums) {
    const need = target - ls;
    let lo = 0, hi = rightSums.length - 1;
    while (lo <= hi) {
      const midI = (lo + hi) >> 1;
      if (rightSums[midI] === need) return true;
      else if (rightSums[midI] < need) lo = midI + 1;
      else hi = midI - 1;
    }
  }
  return false;
}`,solutions:[{approach:`Meet in the middle`,timeComplexity:`O(2^(n/2) log(2^(n/2))) — each half's 2^(n/2) sums, then a sort and binary search`,spaceComplexity:`O(2^(n/2)) to store each half's subset sums`,explanation:`Split the array in half and enumerate every subset sum of each half separately (2^(n/2) each, far smaller than 2ⁿ). Sort one half's sums, then for every sum from the other half, binary-search for the exact complement needed to hit the target.`,code:`function subsetSumExists(nums, target) {
  const n = nums.length;
  const mid = Math.floor(n / 2);
  const left = nums.slice(0, mid);
  const right = nums.slice(mid);
  function allSums(arr) {
    const sums = [0];
    for (const x of arr) {
      const len = sums.length;
      for (let i = 0; i < len; i++) sums.push(sums[i] + x);
    }
    return sums;
  }
  const leftSums = allSums(left);
  const rightSums = allSums(right).sort((a, b) => a - b);
  for (const ls of leftSums) {
    const need = target - ls;
    let lo = 0, hi = rightSums.length - 1;
    while (lo <= hi) {
      const midI = (lo + hi) >> 1;
      if (rightSums[midI] === need) return true;
      else if (rightSums[midI] < need) lo = midI + 1;
      else hi = midI - 1;
    }
  }
  return false;
}`},{approach:`Full subset enumeration (bitmask)`,timeComplexity:`O(2ⁿ · n)`,spaceComplexity:`O(1) extra beyond the loop counters`,explanation:`Walk every possible subset via a bitmask over all n elements and sum it directly. Correct for any input, but the search space doubles with every additional element instead of being split into two independently-enumerable halves.`,code:`function subsetSumExists(nums, target) {
  const n = nums.length;
  for (let mask = 0; mask < (1 << n); mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) sum += nums[i];
    if (sum === target) return true;
  }
  return false;
}`}]}]},{id:`advanced-sweep-line`,name:`Sweep Line`,explanation:`Converting a set of intervals or ranges into discrete start/end events and processing them in position order turns a question about overlapping ranges into a simple running counter.`,problems:[{id:`advanced-sweep-line-car-pooling`,title:`Car Pooling`,difficulty:`Medium`,description:`A car with a given capacity picks up and drops off passengers along a route. Given trips as [numPassengers, from, to] and the car's capacity, return whether the car can complete every trip without ever exceeding capacity.`,fnName:`carPooling`,starterCode:`function carPooling(trips, capacity) {
  
}`,testCases:[{input:[[[2,1,5],[3,3,7]],4],expected:!1},{input:[[[2,1,5],[3,3,7]],5],expected:!0},{input:[[[2,1,5]],1],expected:!1},{input:[[],0],expected:!0},{input:[[[3,2,7],[3,7,9],[8,3,9]],11],expected:!0}],cSignature:{params:[{kind:`intMatrix`,name:`trips`,sizeName:`tripsSize`,cols:3},{kind:`int`,name:`capacity`}],returns:{kind:`bool`}},solution:`function carPooling(trips, capacity) {
  const events = [];
  for (const [num, from, to] of trips) {
    events.push([from, num]);
    events.push([to, -num]);
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let passengers = 0;
  for (const [, delta] of events) {
    passengers += delta;
    if (passengers > capacity) return false;
  }
  return true;
}`,solutions:[{approach:`Sweep line over sorted pickup/dropoff events`,timeComplexity:`O(n log n) — dominated by sorting the 2n events`,spaceComplexity:`O(n) for the event list`,explanation:`Turn every trip into a +passengers event at its pickup point and a -passengers event at its dropoff point, sort all events by position (drop-offs before pick-ups at the same point), then sweep through accumulating the running passenger count — it only needs to check the capacity at points where the count can actually change.`,code:`function carPooling(trips, capacity) {
  const events = [];
  for (const [num, from, to] of trips) {
    events.push([from, num]);
    events.push([to, -num]);
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let passengers = 0;
  for (const [, delta] of events) {
    passengers += delta;
    if (passengers > capacity) return false;
  }
  return true;
}`},{approach:`Difference array over every mile marker`,timeComplexity:`O(n + maxLocation) — bounded by the largest drop-off point, not just the trip count`,spaceComplexity:`O(maxLocation) for the difference array`,explanation:`Apply the same +num/-num deltas directly onto a difference array indexed by location, then walk every single position from 0 to the farthest drop-off, accumulating as it goes. Correct, but it checks capacity at every mile marker rather than only the handful of points where a trip actually starts or ends.`,code:`function carPooling(trips, capacity) {
  const maxLoc = Math.max(0, ...trips.map((t) => t[2])) + 1;
  const diff = new Array(maxLoc + 1).fill(0);
  for (const [num, from, to] of trips) {
    diff[from] += num;
    diff[to] -= num;
  }
  let passengers = 0;
  for (let i = 0; i <= maxLoc; i++) {
    passengers += diff[i];
    if (passengers > capacity) return false;
  }
  return true;
}`}]}]}]},{id:`range-structures`,name:`Range Structures`,subpatterns:[{id:`range-structures-prefix-sum`,name:`Prefix Sum`,explanation:`When the underlying array never changes, precompute a running-total array once so any range sum becomes a single subtraction — the simplest and cheapest range structure, but it breaks the moment the array needs to change.`,problems:[{id:`range-structures-range-sum-immutable`,title:`Range Sum Query - Immutable`,difficulty:`Easy`,description:`Given a fixed array of integers and a list of [left, right] range queries, return the sum of each range (inclusive) — the array itself never changes between queries.`,fnName:`rangeSumQueries`,starterCode:`function rangeSumQueries(nums, queries) {
  
}`,testCases:[{input:[[-2,0,3,-5,2,-1],[[0,2],[2,5],[0,5]]],expected:[1,-1,-3]},{input:[[1],[[0,0]]],expected:[1]},{input:[[1,2,3,4,5],[[1,3]]],expected:[9]},{input:[[],[]],expected:[]},{input:[[5,5,5],[[0,0],[1,1],[0,2]]],expected:[5,5,15]}],cSignature:{params:[{kind:`intArray`,name:`nums`,sizeName:`numsSize`},{kind:`intMatrix`,name:`queries`,sizeName:`queriesSize`,cols:2}],returns:{kind:`intArray`}},solution:`function rangeSumQueries(nums, queries) {
  const prefix = [0];
  for (const n of nums) prefix.push(prefix[prefix.length - 1] + n);
  return queries.map(([l, r]) => prefix[r + 1] - prefix[l]);
}`,solutions:[{approach:`Precomputed prefix sums`,timeComplexity:`O(n) to build, O(1) per query`,spaceComplexity:`O(n) for the prefix array`,explanation:`Build one running-total array up front where prefix[i] is the sum of everything before index i. Any range sum is then just a subtraction of two prefix values — the array never changes, so this upfront cost is paid exactly once no matter how many queries follow.`,code:`function rangeSumQueries(nums, queries) {
  const prefix = [0];
  for (const n of nums) prefix.push(prefix[prefix.length - 1] + n);
  return queries.map(([l, r]) => prefix[r + 1] - prefix[l]);
}`},{approach:`Direct summation per query`,timeComplexity:`O(n) per query`,spaceComplexity:`O(1) extra per query`,explanation:`Just add up the elements in each requested range on the spot. No setup cost, but every query walks the whole range again from scratch — for many queries over the same static array, that's far more total work than paying once for prefix sums.`,code:`function rangeSumQueries(nums, queries) {
  return queries.map(([l, r]) => {
    let sum = 0;
    for (let i = l; i <= r; i++) sum += nums[i];
    return sum;
  });
}`}]}]},{id:`range-structures-segment-tree`,name:`Segment Tree`,explanation:`A binary tree over the array where each node caches the combined result of its range lets both point updates and range queries run in O(log n) — the general-purpose range structure when the array needs to change and any range-combinable operation (sum, min, max, gcd...) is fair game.`,problems:[{id:`range-structures-segment-tree`,title:`Range Sum Query - Mutable (Segment Tree)`,difficulty:`Medium`,description:`Given an initial array and a sequence of operations, support two kinds: ["update", index, value] sets nums[index] to value, and ["query", left, right] returns the sum of nums[left..right] inclusive at that point in time. Return the results in order (null for update operations).`,fnName:`segmentTreeOperations`,starterCode:`function segmentTreeOperations(nums, ops, argsList) {
  // your code here
}`,testCases:[{input:[[1,3,5],[`query`,`update`,`query`],[[0,2],[1,2],[0,2]]],expected:[9,null,8]},{input:[[7],[`query`],[[0,0]]],expected:[7]},{input:[[1,1,1,1],[`query`,`update`,`update`,`query`],[[0,3],[0,5],[3,-1],[0,3]]],expected:[4,null,null,6]},{input:[[2,4,6,8,10],[`query`,`query`],[[1,3],[0,4]]],expected:[18,30]}],solution:`function segmentTreeOperations(nums, ops, argsList) {
  const n = nums.length;
  const tree = new Array(2 * n).fill(0);
  for (let i = 0; i < n; i++) tree[n + i] = nums[i];
  for (let i = n - 1; i > 0; i--) tree[i] = tree[2 * i] + tree[2 * i + 1];
  function update(index, val) {
    let i = index + n;
    tree[i] = val;
    while (i > 1) { i = i >> 1; tree[i] = tree[2 * i] + tree[2 * i + 1]; }
  }
  function query(left, right) {
    let l = left + n, r = right + n + 1;
    let sum = 0;
    while (l < r) {
      if (l & 1) { sum += tree[l]; l++; }
      if (r & 1) { r--; sum += tree[r]; }
      l >>= 1; r >>= 1;
    }
    return sum;
  }
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'update') { update(a[0], a[1]); out.push(null); }
    else if (op === 'query') { out.push(query(a[0], a[1])); }
  }
  return out;
}`,solutions:[{approach:`Iterative bottom-up segment tree`,timeComplexity:`O(log n) per update or query, O(n) to build`,spaceComplexity:`O(n) for the tree array`,explanation:`Store the array as the tree's leaves (indices n..2n-1) and every internal node as the sum of its two children. Updating a leaf only needs to recompute the O(log n) ancestors above it; querying a range walks up from both ends, combining O(log n) precomputed subtree sums instead of every element.`,code:`function segmentTreeOperations(nums, ops, argsList) {
  const n = nums.length;
  const tree = new Array(2 * n).fill(0);
  for (let i = 0; i < n; i++) tree[n + i] = nums[i];
  for (let i = n - 1; i > 0; i--) tree[i] = tree[2 * i] + tree[2 * i + 1];
  function update(index, val) {
    let i = index + n;
    tree[i] = val;
    while (i > 1) { i = i >> 1; tree[i] = tree[2 * i] + tree[2 * i + 1]; }
  }
  function query(left, right) {
    let l = left + n, r = right + n + 1;
    let sum = 0;
    while (l < r) {
      if (l & 1) { sum += tree[l]; l++; }
      if (r & 1) { r--; sum += tree[r]; }
      l >>= 1; r >>= 1;
    }
    return sum;
  }
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'update') { update(a[0], a[1]); out.push(null); }
    else if (op === 'query') { out.push(query(a[0], a[1])); }
  }
  return out;
}`},{approach:`Plain array, recomputed per query`,timeComplexity:`O(1) per update, O(n) per query`,spaceComplexity:`O(n) for the array`,explanation:`Just mutate the array directly on update, and sum the requested range from scratch on every query. Updates are cheaper than the segment tree's O(log n), but each query pays for the whole range every time — worse when queries are frequent relative to updates.`,code:`function segmentTreeOperations(nums, ops, argsList) {
  const arr = [...nums];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'update') { arr[a[0]] = a[1]; out.push(null); }
    else if (op === 'query') {
      let sum = 0;
      for (let j = a[0]; j <= a[1]; j++) sum += arr[j];
      out.push(sum);
    }
  }
  return out;
}`}]}]},{id:`range-structures-fenwick-tree-bit`,name:`Fenwick Tree/BIT`,explanation:`A more compact alternative to a segment tree for prefix-sum-style queries: indices encode ranges via their lowest set bit, giving O(log n) point updates and prefix queries with a much smaller constant factor and less code than a full segment tree.`,problems:[{id:`range-structures-fenwick-tree`,title:`Point Update, Prefix Sum (Fenwick Tree / BIT)`,difficulty:`Medium`,description:`Given an initial array and a sequence of operations, support two kinds: ["add", index, delta] adds delta to nums[index], and ["prefixSum", index] returns the sum of nums[0..index] inclusive at that point in time. Return the results in order (null for add operations).`,fnName:`fenwickOperations`,starterCode:`function fenwickOperations(nums, ops, argsList) {
  // your code here
}`,testCases:[{input:[[1,3,5],[`prefixSum`,`add`,`prefixSum`],[[2],[1,4],[2]]],expected:[9,null,13]},{input:[[7],[`prefixSum`],[[0]]],expected:[7]},{input:[[1,1,1,1],[`prefixSum`,`add`,`prefixSum`],[[3],[0,5],[3]]],expected:[4,null,9]},{input:[[2,4,6,8,10],[`prefixSum`,`prefixSum`],[[1],[4]]],expected:[6,30]}],solution:`function fenwickOperations(nums, ops, argsList) {
  const n = nums.length;
  const tree = new Array(n + 1).fill(0);
  function add(index, delta) {
    for (let i = index + 1; i <= n; i += i & -i) tree[i] += delta;
  }
  function prefixSum(index) {
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) sum += tree[i];
    return sum;
  }
  for (let i = 0; i < n; i++) add(i, nums[i]);
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'add') { add(a[0], a[1]); out.push(null); }
    else if (op === 'prefixSum') { out.push(prefixSum(a[0])); }
  }
  return out;
}`,solutions:[{approach:`Binary Indexed Tree (Fenwick tree)`,timeComplexity:`O(log n) per add or prefixSum, O(n log n) to build`,spaceComplexity:`O(n) for the tree array`,explanation:`Each index in the tree array stores a partial sum covering a range determined by its lowest set bit (i & -i). Adding a delta only touches the O(log n) indices whose ranges include it; a prefix sum accumulates the O(log n) partial ranges that together cover 0..index — both directions exploit the same bit trick.`,code:`function fenwickOperations(nums, ops, argsList) {
  const n = nums.length;
  const tree = new Array(n + 1).fill(0);
  function add(index, delta) {
    for (let i = index + 1; i <= n; i += i & -i) tree[i] += delta;
  }
  function prefixSum(index) {
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) sum += tree[i];
    return sum;
  }
  for (let i = 0; i < n; i++) add(i, nums[i]);
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'add') { add(a[0], a[1]); out.push(null); }
    else if (op === 'prefixSum') { out.push(prefixSum(a[0])); }
  }
  return out;
}`},{approach:`Plain array, recomputed per query`,timeComplexity:`O(1) per add, O(n) per prefixSum`,spaceComplexity:`O(n) for the array`,explanation:`Mutate the array directly on add, and sum from the start on every prefixSum query. Cheaper updates than the Fenwick tree's O(log n), but each query re-walks the whole prefix instead of combining a handful of precomputed partial sums.`,code:`function fenwickOperations(nums, ops, argsList) {
  const arr = [...nums];
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i], a = argsList[i];
    if (op === 'add') { arr[a[0]] += a[1]; out.push(null); }
    else if (op === 'prefixSum') {
      let sum = 0;
      for (let j = 0; j <= a[0]; j++) sum += arr[j];
      out.push(sum);
    }
  }
  return out;
}`}]}]}]},ee];function _(e){for(let t of g)for(let n of t.subpatterns){let r=n.problems.find(t=>t.id===e);if(r)return{pattern:t,subpattern:n,problem:r}}}var v=[{id:`traffic-networking`,name:`Traffic & Networking`,concepts:[{term:`Rate Limiting`,definition:`Limit requests from clients`,deepDiveId:`rate-limiting`},{term:`Caching`,definition:`Store data for faster access`,deepDiveId:`caching`},{term:`Load Balancing`,definition:`Distribute traffic evenly`,deepDiveId:`load-balancing`},{term:`Reverse Proxies`,definition:`Route & protect backend`},{term:`API Gateways`,definition:`Single entry for APIs`},{term:`CI/CD`,definition:`Automate build, test, deploy`},{term:`Docker`,definition:`Package app in containers`},{term:`Kubernetes`,definition:`Orchestrate containers`},{term:`Service Discovery`,definition:`Find services dynamically`},{term:`Circuit Breakers`,definition:`Stop cascading failures`},{term:`Timeouts`,definition:`Avoid waiting too long`},{term:`Retries`,definition:`Retry on temporary failures`},{term:`Exponential Backoff`,definition:`Increase retry delay`},{term:`Idempotency`,definition:`Prevent duplicate actions`}]},{id:`messaging-architecture`,name:`Messaging & Architecture`,concepts:[{term:`Message Queues`,definition:`Async communication`},{term:`Pub/Sub`,definition:`Publish events to subscribers`},{term:`Event-Driven Architecture`,definition:`Decouple services`},{term:`Distributed Transactions`,definition:`Manage across services`},{term:`Saga Pattern`,definition:`Maintain consistency`},{term:`Dead Letter Queues`,definition:`Store failed messages`},{term:`Cron Jobs`,definition:`Schedule background tasks`},{term:`WebSockets`,definition:`Real-time two-way communication`},{term:`Long Polling`,definition:`Real-time-like updates`},{term:`Server-Sent Events`,definition:`Server to client stream`}]},{id:`database-storage`,name:`Database & Storage`,concepts:[{term:`Database Indexing`,definition:`Speed up queries`},{term:`Query Optimization`,definition:`Write efficient queries`},{term:`N+1 Queries`,definition:`Avoid extra DB calls`},{term:`Connection Pooling`,definition:`Reuse connections`},{term:`Read Replicas`,definition:`Scale read operations`},{term:`Sharding`,definition:`Split data across DBs`,deepDiveId:`sharding`},{term:`Partitioning`,definition:`Divide large tables`},{term:`Replication`,definition:`Keep data copies`,deepDiveId:`replication`},{term:`Leader Election`,definition:`Choose leader node`},{term:`CAP Theorem`,definition:`Consistency trade-offs`,deepDiveId:`consistency-models`},{term:`Eventual Consistency`,definition:`Data syncs over time`,deepDiveId:`consistency-models`}]},{id:`concurrency-reliability`,name:`Concurrency & Reliability`,concepts:[{term:`Optimistic Locking`,definition:`Detect conflicts`},{term:`Pessimistic Locking`,definition:`Lock before update`},{term:`Distributed Locks`,definition:`Lock across services`},{term:`Race Conditions`,definition:`Unpredictable outcome`},{term:`Deadlocks`,definition:`Processes blocking each other`},{term:`Memory Leaks`,definition:`Unused memory not freed`},{term:`Garbage Collection`,definition:`Free unused memory`},{term:`Thread Safety`,definition:`Safe in multi-threading`},{term:`Backpressure`,definition:`Handle overload gracefully`}]},{id:`scaling`,name:`Scaling`,concepts:[{term:`Autoscaling`,definition:`Scale based on demand`},{term:`Horizontal Scaling`,definition:`Add more servers`},{term:`Vertical Scaling`,definition:`Increase server power`},{term:`CDN`,definition:`Deliver content globally`},{term:`Edge Caching`,definition:`Cache near user`,deepDiveId:`caching`},{term:`Cache Invalidation`,definition:`Keep cache fresh`,deepDiveId:`caching`}]},{id:`deployment-strategies`,name:`Deployment Strategies`,concepts:[{term:`Feature Flags`,definition:`Enable features safely`},{term:`Blue-Green Deployments`,definition:`Zero downtime`},{term:`Canary Releases`,definition:`Rollout to few users`},{term:`Rolling Deployments`,definition:`Update gradually`},{term:`Rollbacks`,definition:`Revert changes quickly`},{term:`Health Checks`,definition:`Check service health`},{term:`Liveness Probes`,definition:`Is service running?`},{term:`Readiness Probes`,definition:`Is service ready?`}]},{id:`observability`,name:`Observability`,concepts:[{term:`Monitoring`,definition:`Track system health`},{term:`Logging`,definition:`Record events`},{term:`Distributed Tracing`,definition:`Trace requests`},{term:`Metrics`,definition:`Measure performance`},{term:`Alerting`,definition:`Notify on issues`},{term:`SLOs`,definition:`Define reliability goals`},{term:`SLIs`,definition:`Measure reliability`},{term:`Error Budgets`,definition:`Balance reliability`},{term:`Observability`,definition:`Logs + metrics + traces`}]},{id:`security`,name:`Security`,concepts:[{term:`Secrets Management`,definition:`Secure credentials`},{term:`IAM`,definition:`Manage access`},{term:`OAuth`,definition:`Delegated authorization`},{term:`JWT Rotation`,definition:`Refresh tokens safely`},{term:`TLS`,definition:`Encrypt communication`},{term:`Encryption at Rest`,definition:`Protect stored data`},{term:`Encryption in Transit`,definition:`Protect data in motion`},{term:`WAF`,definition:`Filter malicious requests`},{term:`DDoS Protection`,definition:`Stop traffic attacks`},{term:`CORS`,definition:`Control cross-origin access`},{term:`CSRF`,definition:`Prevent forged requests`},{term:`SQL Injection`,definition:`Prevent malicious queries`},{term:`XSS`,definition:`Prevent script injection`},{term:`SSRF`,definition:`Prevent server-side attacks`}]},{id:`data-operations`,name:`Data & Operations`,concepts:[{term:`Database Migrations`,definition:`Update schema`},{term:`Schema Versioning`,definition:`Track DB changes`},{term:`Disaster Recovery`,definition:`Recover from failures`},{term:`Backups`,definition:`Protect data`},{term:`Failover`,definition:`Switch to healthy system`},{term:`Multi-Region Deployments`,definition:`Global availability`},{term:`Chaos Engineering`,definition:`Test system limits`},{term:`Cost Optimization`,definition:`Reduce costs`}]},{id:`performance-metrics`,name:`Performance Metrics`,concepts:[{term:`Cold Starts`,definition:`Serverless startup delay`},{term:`Serverless Limits`,definition:`Know platform limits`},{term:`Latency`,definition:`Time for a request`},{term:`Throughput`,definition:`Requests per second`},{term:`P99 Latency`,definition:`Worst 1% latency`},{term:`Tail Latency`,definition:`Slowest requests`},{term:`Network Partitions`,definition:`Network failures`},{term:`Clock Skew`,definition:`Time differences`}]}],y=v.reduce((e,t)=>e+t.concepts.length,0),b=[{id:`caching`,title:`Caching Strategies`,intro:`Caching isn't one technique — it's a family of strategies that answer three separate questions: when does the app talk to the cache vs. the source of truth, when does a stale entry get thrown out, and where does the cache physically live. Most real systems combine several of these at once (e.g. cache-aside + TTL + LRU eviction, or CDN + browser caching for static assets).`,strategies:[{name:`Cache-Aside (Lazy Loading)`,description:`The app checks the cache first. On a miss, it reads from the database itself and writes the result into the cache before returning. The most common pattern — simple, and the cache only ever holds data that was actually requested.`,diagram:`  Request
     |
     v
 +--------+   hit    +--------+
 | Cache  |--------->| Return |
 +--------+          +--------+
     | miss
     v
 +--------+ populate +--------+
 |   DB   |--------->| Cache  |---> Return
 +--------+          +--------+`,code:`async function getUser(id) {
  let user = await cache.get(\`user:\${id}\`);
  if (user) return user;                 // cache hit

  user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  await cache.set(\`user:\${id}\`, user, { ttl: 300 });
  return user;                           // cache miss, now populated
}`},{name:`Read-Through`,description:`Same idea as cache-aside, but the cache library itself owns the miss-fill logic via a configured loader function. App code only ever talks to the cache — it never touches the database directly for reads.`,diagram:`  Request
     |
     v
 +----------------------+
 |        Cache          |
 |  hit  -----------------> Return
 |  miss -> loader(key) -> DB
 |          stores + returns
 +----------------------+`,code:`const cache = new ReadThroughCache({
  loader: (id) => db.query('SELECT * FROM users WHERE id = ?', [id]),
  ttl: 300,
});

const user = await cache.get(\`user:\${id}\`); // cache handles the miss internally`},{name:`Write-Through`,description:`Every write goes to the cache and the database in the same synchronous operation, and isn't acknowledged until both succeed. The cache is always consistent with the DB, at the cost of extra write latency.`,diagram:`  Write(key, val)
       |
       v
  +--------+   sync   +--------+
  | Cache  |--------->|   DB   |
  +--------+          +--------+
       |                   |
       +--------+----------+
                v
     Write acknowledged
   (only after BOTH succeed)`,code:`async function updateUser(id, data) {
  await db.update('users', id, data);   // 1. write DB
  await cache.set(\`user:\${id}\`, data);  // 2. write cache
  // caller waits for both -- cache and DB never disagree
}`},{name:`Write-Behind (Write-Back)`,description:`The write lands in the cache and is acknowledged immediately; the cache asynchronously flushes it to the DB later, often batched. Much faster writes, but a crash before the flush can lose data — used when throughput matters more than durability.`,diagram:`  Write(key, val)
       |
       v
  +--------+  ack immediately
  | Cache  |------------------> caller continues
  +---+----+
      | async, batched, delayed
      v
  +--------+
  |   DB   |  flushed later
  +--------+`,code:`async function updateUser(id, data) {
  await cache.set(\`user:\${id}\`, data);  // instant ack
  writeQueue.push({ id, data });         // flushed by a background worker
}

// background worker, runs every few seconds
setInterval(() => flushQueueToDb(writeQueue), 5000);`},{name:`Write-Around`,description:`Writes go straight to the database, bypassing the cache entirely. The cache only gets populated later, on a normal cache-aside read. Keeps the cache from filling up with data that's written once and rarely re-read (e.g. audit logs).`,diagram:`  Write(key, val)
       |
       v
  +--------+
  |   DB   |   (cache untouched)
  +--------+

  ...later...
  Read(key) -> Cache MISS -> DB -> populate cache -> Return`,code:`async function logEvent(event) {
  await db.insert('events', event);   // cache never touched on write
}

async function getEvent(id) {
  // standard cache-aside read path picks it up on first access
  return getUser(id);
}`},{name:`TTL / Time-Based Expiration`,description:`Every cached entry gets a max lifetime. Once it expires it's treated as a miss and reloaded on next access — bounds staleness without needing explicit invalidation logic. Usually layered on top of one of the strategies above.`,diagram:`  t=0        entry cached, ttl=300s
  t=299      still served from cache
  t=300  --> entry expires (deleted or marked stale)
  t=301      next request = miss, reload from source`,code:"await cache.set(`user:${id}`, user, { ttl: 300 }); // seconds\n\n// most cache libraries auto-evict on read once past ttl:\nconst cached = await cache.get(`user:${id}`); // null if expired"},{name:`Eviction Policy — LRU (Least Recently Used)`,description:`When the cache hits its size limit, something has to go. LRU evicts whichever entry hasn't been accessed the longest — a cheap, usually-good default. (Variants: LFU evicts the least frequently used entry, FIFO evicts the oldest-inserted regardless of use, MRU evicts the most-recently-used, useful for cyclic scan patterns.) This is the exact concept the 'LRU Cache' problem in this app's System Design track codes by hand.`,diagram:`  Capacity = 3        MRU ---------------- LRU
  access A         [ A ]
  access B         [ B, A ]
  access C         [ C, B, A ]
  access A         [ A, C, B ]   (A moves to front)
  access D         [ D, A, C ]   (B evicted -- least recently used)`,code:`class LRUCache {
  constructor(capacity) { this.capacity = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key);
    this.map.delete(key); this.map.set(key, val); // move to 'most recent'
    return val;
  }
  set(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) this.map.delete(this.map.keys().next().value);
    this.map.set(key, val);
  }
}`},{name:`CDN / Edge Caching`,description:`Static (or semi-static) responses are cached at points of presence geographically close to users, not just at the origin. Requests hit the nearest edge node first; only a miss travels all the way back to the origin server.`,diagram:`  User (Tokyo)              User (London)
      |                          |
      v                          v
  Edge POP (Tokyo)          Edge POP (London)
   hit -> return             hit -> return
   miss |                    miss |
        +----------+--------------+
                   v
             Origin Server
           (single source of truth)`,code:`// response header from the origin -- tells the CDN how long to cache
Cache-Control: public, max-age=3600, s-maxage=86400
// max-age  = browser cache lifetime
// s-maxage = shared/CDN cache lifetime (overrides max-age for edge nodes)`},{name:`Distributed Caching (Redis / Memcached)`,description:`A cache shared across every app server instance, instead of an in-process cache local to one server. Needed once you scale horizontally — otherwise each server keeps its own copy, which duplicates memory and goes stale independently of the others.`,diagram:`  App Server 1 --+
  App Server 2 --+--> Shared Redis Cluster --> DB
  App Server 3 --+     (one cache, every server sees the same entries)`,code:`const redis = new Redis({ host: 'cache.internal', port: 6379 });

async function getUser(id) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  await redis.set(\`user:\${id}\`, JSON.stringify(user), 'EX', 300);
  return user;
}`},{name:`Browser / HTTP Caching`,description:`The browser caches responses per HTTP headers, skipping the network entirely on a fresh hit, or doing a cheap 304 round-trip on a revalidation. Cache-Control governs freshness; ETag / If-None-Match governs revalidation once an entry goes stale.`,diagram:`  Request -> Browser cache
    fresh (within max-age)  -> serve from disk/memory, 0 network calls
    stale, has ETag         -> GET + If-None-Match: "abc123"
                                304 Not Modified -> serve cached body
                                200 OK           -> new body, re-cache`,code:`// server response headers
Cache-Control: max-age=600
ETag: "abc123"

// browser's follow-up request once stale
GET /data.json
If-None-Match: "abc123"
// server replies 304 Not Modified (no body) if the ETag still matches`},{name:`Cache Invalidation (on write)`,description:`Instead of waiting for a TTL to expire a now-stale entry, explicitly delete (or overwrite) it the moment the underlying data changes. Guarantees the next read is fresh instead of serving stale data for up to a full TTL window.`,diagram:`  Write(key, val)
       |
       v
  +--------+        +-------------------+
  |   DB   |------->| del cache[key]      |  (or overwrite with new val)
  +--------+        +-------------------+
       |
       v
  Next read = guaranteed miss -> reload fresh value`,code:`async function updateUser(id, data) {
  await db.update('users', id, data);
  await cache.del(\`user:\${id}\`);   // invalidate instead of update
  // next read is a guaranteed miss -> cache-aside reloads fresh data
}`}]},{id:`rate-limiting`,title:`Rate Limiting Strategies`,intro:`Rate limiting answers 'how many requests can this client make, how fast' — and the five common algorithms differ mainly in how precisely they track time and whether they allow short bursts through. Simpler algorithms are cheaper but let bursts slip past window boundaries; more precise ones cost more memory or computation per request.`,practiceSubId:`sysdes-traffic-control`,strategies:[{name:`Fixed Window Counter`,description:`Divide time into fixed-size windows (e.g. every 60s), count requests per window, and reset the counter when the window rolls over. Cheap, but a client can send the full limit right at the end of one window and the full limit again right at the start of the next — up to 2x the limit in a very short burst around the boundary.`,diagram:`  window: [0-60s]        [60-120s]       [120-180s]
  count:     0->limit        0->limit        0->limit
                     ^ reset            ^ reset
  Problem: a burst at 0:59 + a burst at 1:00 = 2x limit in ~1 second`,code:`const counters = new Map(); // key -> { count, windowStart }

function allow(key, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const entry = counters.get(key);
  if (!entry || now - entry.windowStart >= windowMs) {
    counters.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}`},{name:`Sliding Window Log`,description:`Keep a timestamped log of every request in the last window; on each new request, drop timestamps older than the window and check the log's length against the limit. Exact — no boundary-burst problem — but memory grows with request volume since every timestamp is kept.`,diagram:`  now = t
  log = [t-58, t-40, t-12, t-3]   (all within the last 60s)
  drop anything < t-60
  if log.length < limit -> allow, push(t)
  else -> reject`,code:`const logs = new Map(); // key -> timestamps[]

function allow(key, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const arr = (logs.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) { logs.set(key, arr); return false; }
  arr.push(now);
  logs.set(key, arr);
  return true;
}`},{name:`Sliding Window Counter`,description:`A cheaper approximation of the sliding log: keep just two fixed-window counters (current + previous) and weight the previous window's count by how much of it still overlaps the sliding window. Smooths out the fixed-window boundary-burst problem without storing every timestamp.`,diagram:`  |---- prev window ----|---- current window ----|
                     now-60s                    now
  weighted count = prevCount * overlapFraction + currCount`,code:`function allow(key, limit, windowMs, store) {
  const now = Date.now();
  const { prevCount, currCount, currStart } =
    store.get(key) ?? { prevCount: 0, currCount: 0, currStart: now };
  const elapsed = now - currStart;
  const overlap = Math.max(0, (windowMs - elapsed) / windowMs);
  const weighted = prevCount * overlap + currCount;
  if (weighted >= limit) return false;
  store.set(key, { prevCount, currCount: currCount + 1, currStart });
  return true;
}`},{name:`Token Bucket`,description:`A bucket holds up to N tokens and refills at a steady rate; every request consumes one token and is rejected if the bucket is empty. Naturally allows short bursts (up to the bucket size) while still enforcing a long-run average rate.`,diagram:`    refill rate: 10 tokens/sec
    +------------------+
    |  * * * * * * *   |  <- bucket (max 20 tokens)
    +------------------+
         | request consumes 1 token
         v
    tokens > 0 ? allow : reject`,code:`function allow(bucket, now, capacity = 20, refillPerSec = 10) {
  const elapsed = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillPerSec);
  bucket.lastRefill = now;
  if (bucket.tokens < 1) return false;
  bucket.tokens -= 1;
  return true;
}`},{name:`Leaky Bucket`,description:`Requests queue into a fixed-size bucket that 'leaks' (processes) at a constant rate; if the bucket is full, new requests are dropped. Unlike token bucket, this smooths output to a strictly constant rate instead of letting bursts through.`,diagram:`   requests -> [ bucket (max size N) ] -> leaks out at fixed rate
                       |
                 full? -> reject new requests`,code:`class LeakyBucket {
  constructor(capacity, leakPerSec) {
    this.capacity = capacity; this.leakPerSec = leakPerSec;
    this.queue = 0; this.lastLeak = Date.now();
  }
  allow() {
    const now = Date.now();
    const leaked = ((now - this.lastLeak) / 1000) * this.leakPerSec;
    this.queue = Math.max(0, this.queue - leaked);
    this.lastLeak = now;
    if (this.queue >= this.capacity) return false;
    this.queue += 1;
    return true;
  }
}`}]},{id:`load-balancing`,title:`Load Balancing Strategies`,intro:`Load balancing decides which server handles the next request. The five common algorithms trade off simplicity, fairness under uneven server capacity, adaptiveness to real-time load, and whether the same client reliably lands on the same server.`,strategies:[{name:`Round Robin`,description:`Cycle through the server list in order, one request per server, wrapping back to the start. Simple and fair when all servers and requests are roughly equal — doesn't account for server load or request cost.`,diagram:`  servers: [A, B, C]
  req1 -> A
  req2 -> B
  req3 -> C
  req4 -> A   (wraps around)`,code:`let i = 0;
function pickServer(servers) {
  const server = servers[i % servers.length];
  i++;
  return server;
}`},{name:`Weighted Round Robin`,description:`Same rotation, but servers with more capacity get proportionally more turns — a weight-3 server is picked 3x as often as a weight-1 server. Fixes plain round robin's blindness to heterogeneous server capacity.`,diagram:`  A(weight 3), B(weight 1)
  sequence: A, A, A, B, A, A, A, B, ...`,code:`function pickServer(servers) { // [{ server, weight }]
  const pool = servers.flatMap((s) => Array(s.weight).fill(s.server));
  return pool[Math.floor(Math.random() * pool.length)];
}`},{name:`Least Connections`,description:`Route each new request to whichever server currently has the fewest active/in-flight connections. Adapts to uneven request costs (some requests are slow, some fast) better than round robin, at the cost of tracking live connection counts.`,diagram:`  A: 12 active   B: 4 active   C: 9 active
  new request -> B  (fewest active connections)`,code:`function pickServer(servers) { // [{ server, activeConnections }]
  return servers.reduce((min, s) =>
    s.activeConnections < min.activeConnections ? s : min
  ).server;
}`},{name:`IP Hash (Source Hashing)`,description:`Hash the client's IP (or another stable key) to deterministically map it to the same server every time. Gives you 'sticky sessions' without a session store — the same client always lands on the same backend.`,diagram:`  hash(clientIP) % serverCount = index
  client 203.0.113.7 -> always server[hash(...) % N]`,code:`function hashCode(str) {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}
function pickServer(servers, clientIp) {
  return servers[hashCode(clientIp) % servers.length];
}`},{name:`Consistent Hashing`,description:"Map both servers and keys onto a hash ring; a key routes to the next server clockwise from its position. Adding/removing a server only reshuffles the keys between it and its neighbor on the ring, instead of remapping almost everything the way plain `hash % N` would when N changes — critical for caches/shards that must stay stable as the fleet resizes.",diagram:`          server A (hash=10)
             .
    key X (hash=95) .      . server B (hash=40)
                ring goes clockwise
             .
          server C (hash=70)

    key X (95) -> next server clockwise -> A (wraps to 10)`,code:`class ConsistentHashRing {
  constructor(servers) {
    this.ring = servers
      .map((s) => ({ server: s, hash: hashCode(s) }))
      .sort((a, b) => a.hash - b.hash);
  }
  pickServer(key) {
    const h = hashCode(key);
    const next = this.ring.find((entry) => entry.hash >= h);
    return (next ?? this.ring[0]).server; // wrap around the ring
  }
}`}]},{id:`sharding`,title:`Sharding Strategies`,intro:`Sharding splits one dataset across multiple databases so no single machine has to hold (or serve) all of it. The four common strategies differ in what they optimize for: fast range queries, even write distribution, rebalancing flexibility, or physical proximity to users.`,strategies:[{name:`Range-Based Sharding`,description:`Partition rows by a key range (e.g. user_id 1-1,000,000 -> shard 1, 1,000,001-2,000,000 -> shard 2). Range queries stay fast (a scan hits one shard), but traffic/data can skew badly if writes cluster at one end of the range — e.g. auto-incrementing ids all landing on the newest shard.`,diagram:`  shard 1: user_id  1          - 1,000,000
  shard 2: user_id  1,000,001  - 2,000,000
  shard 3: user_id  2,000,001  - 3,000,000
        (new signups all pile onto shard 3 -- hot shard risk)`,code:"function shardFor(userId, rangeSize = 1_000_000) {\n  return `shard-${Math.floor((userId - 1) / rangeSize) + 1}`;\n}"},{name:`Hash-Based Sharding`,description:`Hash the shard key and mod by shard count to pick a shard. Spreads writes evenly (no hot shard from sequential ids), but range queries ('all users signed up this week') now have to fan out to every shard since related rows are scattered.`,diagram:`  shard = hash(userId) % shardCount
  user 4821 -> hash -> shard 2
  user 4822 -> hash -> shard 0   (neighbors land on different shards)`,code:`function shardFor(userId, shardCount) {
  return hashCode(String(userId)) % shardCount;
}`},{name:`Directory-Based (Lookup Table) Sharding`,description:`A separate lookup service/table explicitly maps each key to its shard, instead of computing it. Most flexible — you can rebalance by moving individual keys and updating the map — but the lookup service becomes a new dependency and potential bottleneck/single point of failure.`,diagram:`  key -> [ Lookup Service ] -> shard id
            id: 501 -> shard-2
            id: 502 -> shard-1
            id: 503 -> shard-2
    (rebalancing = just update the map, no rehashing everything)`,code:`const shardMap = new Map(); // userId -> shardId, persisted somewhere durable

function shardFor(userId) {
  return shardMap.get(userId) ?? assignNewUserToLeastLoadedShard(userId);
}`},{name:`Geo-Based Sharding`,description:`Shard by the user/data's geographic region (e.g. US-East shard, EU shard, APAC shard) so data stays physically close to the users reading/writing it. Cuts latency and can satisfy data-residency/compliance rules, but cross-region queries and users who travel/relocate get more complicated.`,diagram:`  user in Germany -> EU shard (Frankfurt)
  user in Japan    -> APAC shard (Tokyo)
  user in Ohio     -> US shard (Ohio)
    each shard's data physically lives near its region's users`,code:`const REGION_SHARDS = { EU: 'eu-frankfurt', APAC: 'apac-tokyo', US: 'us-ohio' };

function shardFor(userRegion) {
  return REGION_SHARDS[userRegion] ?? REGION_SHARDS.US; // fallback region
}`}]},{id:`replication`,title:`Replication Strategies`,intro:`Replication keeps copies of the same data on multiple nodes for durability and read scalability. The three common topologies trade off write-path simplicity, multi-region write latency, and how conflicts between concurrent writes get resolved.`,strategies:[{name:`Leader-Follower (Primary-Replica)`,description:`All writes go to a single leader, which replicates changes to one or more followers; reads can be served from either. Simple to reason about (one source of truth for writes), but the leader is a write bottleneck and a failover — promoting a follower — is needed if it goes down.`,diagram:`         writes
           |
           v
       +--------+   replicate   +------------+
       | Leader |-------------->| Follower 1 |
       +--------+                +------------+
           |        replicate    +------------+
           +--------------------->| Follower 2 |
                                   +------------+
    reads can hit the leader OR any follower`,code:`async function write(data) {
  await leaderDb.write(data);          // only the leader accepts writes
  // followers pick up the change async via replication log
}
async function read(query, { allowStale = true } = {}) {
  return allowStale ? followerDb.read(query) : leaderDb.read(query);
}`},{name:`Multi-Leader`,description:`Multiple nodes each accept writes independently and replicate to each other — useful for multi-datacenter setups where you want low-latency local writes in each region. The tradeoff is conflict resolution: two leaders can accept conflicting writes to the same record before they've synced.`,diagram:`   US Leader <----replicate----> EU Leader
      ^                              ^
    local writes                 local writes
      (both accept writes; conflicting edits need resolution)`,code:`function resolveConflict(writeA, writeB) {
  // last-write-wins by timestamp is the simplest (and lossy) strategy;
  // real systems often use vector clocks or CRDTs instead
  return writeA.timestamp >= writeB.timestamp ? writeA : writeB;
}`},{name:`Leaderless (Quorum-Based)`,description:`Any node can accept a read or write; a write is considered successful once it's acknowledged by W of N replicas, and a read queries R replicas and returns the most recent value. As long as W + R > N, every read is guaranteed to overlap with the latest write (Dynamo-style).`,diagram:`   N = 5 replicas
   write: send to all 5, wait for W=3 acks -> success
   read:  query R=3 replicas, return the newest timestamp among them
   W + R (3+3=6) > N (5) -> every read set overlaps the write set`,code:`async function write(key, value, replicas, W = 3) {
  const acks = await Promise.allSettled(replicas.map((r) => r.write(key, value)));
  const succeeded = acks.filter((a) => a.status === 'fulfilled').length;
  if (succeeded < W) throw new Error('write quorum not reached');
}
async function read(key, replicas, R = 3) {
  const results = await Promise.all(replicas.slice(0, R).map((r) => r.read(key)));
  return results.sort((a, b) => b.timestamp - a.timestamp)[0]; // newest wins
}`}]},{id:`consistency-models`,title:`Consistency Models`,intro:`Once data is replicated, 'consistency' asks: after a write, what can a read see, and when? The four common models trade off how immediately correct every read is against how available and fast the system stays — this is the tension behind the 'C' in CAP theorem.`,strategies:[{name:`Strong Consistency`,description:`Every read reflects the most recent write, everywhere, immediately — as if there were only one copy of the data. Easiest to reason about, but requires coordination (e.g. a quorum or single leader) on every operation, which costs latency and can block during a network partition — the 'C' in CAP, traded against availability.`,diagram:`  write(x=5) completes
        |
        v
  ANY subsequent read, on ANY replica, sees x=5 immediately
  (no window where a replica can return a stale value)`,code:`async function write(key, value) {
  await Promise.all(allReplicas.map((r) => r.write(key, value))); // wait for ALL
}
async function read(key) {
  return leaderReplica.read(key); // reads always go to the single source of truth
}`},{name:`Eventual Consistency`,description:`Writes propagate to all replicas asynchronously; reads may return a stale value for a while, but every replica converges to the same value once updates stop arriving. Trades immediate correctness for availability and low write latency — the 'AP' side of CAP.`,diagram:`  t=0     write(x=5) hits replica A
  t=0     read from replica B still returns x=4 (stale)
  t=50ms  replication catches up
  t=50ms  read from replica B now returns x=5 (converged)`,code:`async function write(key, value) {
  await replicaA.write(key, value);          // ack immediately
  replicateAsync(key, value, otherReplicas);  // fire-and-forget to the rest
}
async function read(key, replica) {
  return replica.read(key); // may be stale depending on which replica you hit
}`},{name:`Causal Consistency`,description:`Writes that are causally related (B happened after seeing A) are seen by every replica in that same order; unrelated writes can be seen in any order. A middle ground — cheaper than strong consistency, but stronger than plain eventual consistency (e.g. a reply always appears after the comment it replies to, even if replicas disagree on unrelated posts' ordering).`,diagram:`  A: "Anyone up for lunch?"                        (write 1)
  B: "Yes! 12pm?"  (reply, causally depends on A)   (write 2)

  Every replica must show A before B.
  An unrelated post C, with no causal link, can appear in any order.`,code:`async function write(key, value, dependsOn = []) {
  await waitForDependencies(dependsOn);   // ensure causally-prior writes are visible first
  return replica.write(key, value, { vectorClock: nextClock(dependsOn) });
}`},{name:`Read-Your-Writes Consistency`,description:`A specific, narrower guarantee — a client is guaranteed to see its own writes on its subsequent reads, even if other clients might still see a stale value. Common trick: route a client's reads to whichever replica handled its last write (or the leader) for a short window after writing.`,diagram:`  Client X writes x=5 to replica A
  Client X reads x -> guaranteed to see 5 (routed back to replica A, or leader)
  Client Y reads x from replica B -> might still see the old value`,code:`async function write(clientId, key, value) {
  const replica = await leaderReplica.write(key, value);
  stickySession.set(clientId, { replica, until: Date.now() + 5000 });
}
async function read(clientId, key) {
  const sticky = stickySession.get(clientId);
  const replica = sticky && sticky.until > Date.now() ? sticky.replica : anyReplica();
  return replica.read(key);
}`}]}];function x(e){return b.find(t=>t.id===e)}var S=[{id:`javascript`,name:`JavaScript`,tagline:`The language this whole app runs on. Core built-ins, from array basics to prototype internals.`,categories:[{id:`js-arrays`,name:`Arrays`,items:[{name:`push(item)`,level:`beginner`,summary:`Add item(s) to the end (mutates), returns new length.`,example:`arr.push(4)`},{name:`pop()`,level:`beginner`,summary:`Remove and return the last item (mutates).`},{name:`shift()`,level:`beginner`,summary:`Remove and return the first item (mutates).`},{name:`unshift(item)`,level:`beginner`,summary:`Add item(s) to the start (mutates).`},{name:`length`,level:`beginner`,summary:`Property: number of items in the array.`},{name:`indexOf(item)`,level:`beginner`,summary:`First index of item, or -1 if not found.`},{name:`includes(item)`,level:`beginner`,summary:`True/false whether the array contains item — correctly handles NaN, unlike indexOf.`},{name:`slice(start, end)`,level:`beginner`,summary:`Shallow copy of a portion; does not mutate the original.`},{name:`map(fn)`,level:`intermediate`,summary:`New array with fn applied to every item.`},{name:`filter(fn)`,level:`intermediate`,summary:`New array of items where fn returns true.`},{name:`reduce(fn, init)`,level:`intermediate`,summary:`Fold the array down to a single value, left to right.`,deepDiveId:`js-reduce`},{name:`forEach(fn)`,level:`intermediate`,summary:`Run fn on every item; returns undefined — no chaining.`},{name:`find(fn) / findIndex(fn)`,level:`intermediate`,summary:`First matching item (or its index), or undefined/-1.`},{name:`some(fn) / every(fn)`,level:`intermediate`,summary:`True if fn holds for at least one / all items.`},{name:`sort(fn)`,level:`intermediate`,summary:`Sorts in place; without a comparator it sorts as strings — [10,2].sort() gives [10,2], not [2,10].`,deepDiveId:`js-sort`},{name:`concat(other)`,level:`intermediate`,summary:`New array combining this with other array(s), no mutation.`},{name:`flat(depth) / flatMap(fn)`,level:`intermediate`,summary:`Flatten nested arrays; flatMap is map() then flat(1) in one pass.`},{name:`join(sep)`,level:`intermediate`,summary:`Join items into a string with sep as separator.`},{name:`splice(start, count, ...items)`,level:`intermediate`,summary:`Remove/insert in place; returns removed items — the only method that both mutates and inserts.`,deepDiveId:`js-splice`},{name:`Array.from(iterable)`,level:`advanced`,summary:`Build a real array from an iterable or array-like (NodeList, arguments, a Set).`},{name:`Array.of(...items)`,level:`advanced`,summary:`Build from arguments directly, avoiding the new Array(7) 'length 7' footgun.`},{name:`reduceRight(fn, init)`,level:`advanced`,summary:`Like reduce but folds right to left.`},{name:`copyWithin(target, start, end)`,level:`advanced`,summary:`Copy a slice of the array onto itself, in place, without changing length.`},{name:`Symbol.iterator`,level:`advanced`,summary:`What makes arrays work with for...of and spread — arrays are iterable, not just indexable.`}]},{id:`js-strings`,name:`Strings`,items:[{name:`length`,level:`beginner`,summary:`Property: number of UTF-16 code units.`},{name:`toUpperCase() / toLowerCase()`,level:`beginner`,summary:`Case conversion.`},{name:`trim()`,level:`beginner`,summary:`Remove whitespace from both ends.`},{name:`slice(start, end)`,level:`beginner`,summary:`Extract a substring; supports negative indices, unlike substring().`},{name:`split(sep)`,level:`beginner`,summary:`Split into an array of substrings.`},{name:`includes(sub) / indexOf(sub)`,level:`beginner`,summary:`Substring search.`},{name:`replace(pattern, replacement)`,level:`beginner`,summary:`Replace the first match only.`},{name:`replaceAll(pattern, replacement)`,level:`intermediate`,summary:`Replace every match; pattern can be a string or a /g regex.`},{name:`padStart(len, pad) / padEnd(len, pad)`,level:`intermediate`,summary:`Pad to a target length — e.g. zero-padding numbers.`},{name:`repeat(n) / startsWith(sub) / endsWith(sub)`,level:`intermediate`,summary:`Repeat, or check prefix/suffix.`},{name:"Template literals `${}`",level:`intermediate`,summary:`Multi-line strings with embedded expressions.`},{name:`normalize()`,level:`advanced`,summary:`Normalize Unicode representation (e.g. combining accents) so string comparisons work correctly.`},{name:`matchAll(regex)`,level:`advanced`,summary:`Iterator of all regex matches with capture groups (regex needs the /g flag).`},{name:`String.raw`,level:`advanced`,summary:`Tagged template returning the raw string, ignoring escape sequences — used for regex/paths.`},{name:`codePointAt(i)`,level:`advanced`,summary:`Like charCodeAt but correctly handles characters outside the Basic Multilingual Plane (emoji, etc.).`}]},{id:`js-objects`,name:`Objects`,items:[{name:`Object.keys(obj) / values(obj) / entries(obj)`,level:`beginner`,summary:`Arrays of an object's own enumerable keys, values, or [key, value] pairs.`},{name:`Object.assign(target, ...sources)`,level:`beginner`,summary:`Shallow-copy/merge properties into target (mutates target).`},{name:`Spread {...obj}`,level:`intermediate`,summary:`Shallow copy/merge without mutating the original.`},{name:"Destructuring `const {a, b} = obj`",level:`intermediate`,summary:`Pull named properties into local variables.`},{name:`Object.freeze(obj)`,level:`intermediate`,summary:`Prevent adding/removing/reassigning top-level properties — shallow only, nested objects stay mutable.`},{name:`Object.fromEntries(pairs)`,level:`intermediate`,summary:`Build an object back from [key, value] pairs — inverse of Object.entries.`},{name:"Optional chaining `obj?.a?.b`",level:`intermediate`,summary:`Short-circuits to undefined instead of throwing on a missing intermediate property.`},{name:"Nullish coalescing `a ?? b`",level:`intermediate`,summary:`Falls back only on null/undefined, unlike || which also falls back on 0 or ''.`},{name:`Object.defineProperty`,level:`advanced`,summary:`Define a property with fine-grained control: getter/setter, enumerable, writable, configurable.`},{name:`Object.getPrototypeOf / setPrototypeOf`,level:`advanced`,summary:`Read or change what an object delegates lookups to.`},{name:`Proxy`,level:`advanced`,summary:`Intercept fundamental operations (get/set/has/deleteProperty) on an object.`},{name:`Reflect`,level:`advanced`,summary:`Companion to Proxy — the default behaviors you'd otherwise reimplement by hand inside traps.`},{name:`structuredClone(obj)`,level:`advanced`,summary:`Built-in deep clone, handles cycles/Maps/Sets — unlike JSON.parse(JSON.stringify()).`}]},{id:`js-numbers`,name:`Numbers & Math`,items:[{name:`parseInt / parseFloat`,level:`beginner`,summary:`Parse a string into a number.`},{name:`toFixed(n)`,level:`beginner`,summary:`Format to n decimal places, returns a string.`},{name:`Math.round / floor / ceil / trunc`,level:`beginner`,summary:`Rounding variants.`},{name:`Math.random()`,level:`beginner`,summary:`Random float in [0, 1).`},{name:`Math.max / Math.min`,level:`beginner`,summary:`Largest/smallest of the given arguments.`},{name:`Number.isInteger(x)`,level:`intermediate`,summary:`Safer than a modulo check — correctly false for NaN/Infinity.`},{name:`Number.isNaN(x)`,level:`intermediate`,summary:`Unlike global isNaN(), doesn't coerce its argument first.`},{name:`Number.EPSILON`,level:`intermediate`,summary:`Smallest representable difference — use for float comparisons instead of ===.`},{name:"Math.pow(base, exp) / `**`",level:`intermediate`,summary:`Exponentiation.`},{name:`Math.sqrt / Math.cbrt`,level:`intermediate`,summary:`Square/cube root.`},{name:`Math.hypot(...values)`,level:`advanced`,summary:`sqrt(sum of squares) in one call, avoids intermediate overflow.`},{name:`BigInt`,level:`advanced`,summary:`Arbitrary-precision integers (123n) for values beyond Number.MAX_SAFE_INTEGER.`},{name:`Number.MAX_SAFE_INTEGER`,level:`advanced`,summary:`Above 2^53-1, integer math silently loses precision — the reason BigInt exists.`}]},{id:`js-collections`,name:`Map, Set, WeakMap, WeakSet`,items:[{name:`new Map() / .set / .get / .has / .delete`,level:`beginner`,summary:`Key-value store where keys can be any type, unlike plain objects which coerce keys to strings.`},{name:`new Set() / .add / .has / .delete`,level:`beginner`,summary:`Collection of unique values.`},{name:`Map/Set .size`,level:`beginner`,summary:`Property: number of entries.`},{name:`for...of over Map/Set`,level:`intermediate`,summary:`Map yields [key, value] pairs; Set yields values directly.`},{name:`[...set] / Array.from(set)`,level:`intermediate`,summary:`Dedupe an array in one line: [...new Set(arr)].`},{name:`WeakMap / WeakSet`,level:`advanced`,summary:`Keys must be objects, held weakly — entries can be garbage-collected, preventing leaks in object-keyed caches.`},{name:`Map for O(1) memoization`,level:`advanced`,summary:`A Map keyed by an argument tuple/string as a memo cache, vs. an object's string-only keys.`}]},{id:`js-async`,name:`Async & Promises`,items:[{name:`new Promise((resolve, reject) => ...)`,level:`beginner`,summary:`Wrap async work in a value that eventually settles.`},{name:`.then / .catch / .finally`,level:`beginner`,summary:`React to a Promise's fulfillment, rejection, or either.`},{name:`async/await`,level:`beginner`,summary:`Syntactic sugar over Promises — await pauses the async function until the Promise settles.`},{name:`try/catch around await`,level:`intermediate`,summary:`How you catch rejections with async/await instead of .catch().`},{name:`Promise.all(promises)`,level:`intermediate`,summary:`Run in parallel, resolves when ALL succeed, rejects immediately if ANY fails.`,deepDiveId:`js-promise-combinators`},{name:`Promise.allSettled(promises)`,level:`intermediate`,summary:`Run in parallel, always resolves with each result's status — never short-circuits on failure.`,deepDiveId:`js-promise-combinators`},{name:`Promise.race(promises)`,level:`intermediate`,summary:`Settles as soon as the first promise settles, fulfilled or rejected.`,deepDiveId:`js-promise-combinators`},{name:`Promise.any(promises)`,level:`advanced`,summary:`Settles on the first fulfillment; rejects only if ALL reject (AggregateError).`,deepDiveId:`js-promise-combinators`},{name:`Microtask vs. macrotask ordering`,level:`advanced`,summary:`Promise callbacks run before setTimeout callbacks, even setTimeout(fn, 0) — explains surprising execution order.`},{name:`AbortController`,level:`advanced`,summary:`Standard cancellation signal, e.g. to cancel a fetch() or your own long-running async work.`},{name:`Async generators / for await...of`,level:`advanced`,summary:`Iterate an async sequence (e.g. paginated API results) with normal for-loop syntax.`}]},{id:`js-functions`,name:`Functions & Closures`,items:[{name:`Function declaration vs. expression`,level:`beginner`,summary:`Declarations are hoisted; expressions are not.`},{name:`Arrow functions`,level:`beginner`,summary:`No own this/arguments — inherits from the enclosing scope, which is why they're wrong for object methods needing this.`},{name:`Default parameters`,level:`beginner`,summary:`function f(x = 1) — fallback used only when the argument is undefined.`},{name:`Rest parameters (...args)`,level:`beginner`,summary:`Collect remaining arguments into a real array.`},{name:`Closures`,level:`intermediate`,summary:`A function remembers variables from its enclosing scope even after that scope has returned — the basis of private state without classes.`,deepDiveId:`js-closures`},{name:`Higher-order functions`,level:`intermediate`,summary:`Functions that take or return other functions (map/filter/reduce are all HOFs).`},{name:`Currying`,level:`intermediate`,summary:`Transforming f(a, b, c) into f(a)(b)(c) — enables partial application.`},{name:`call / apply / bind`,level:`advanced`,summary:`Explicitly set what this refers to; apply/call invoke immediately, bind returns a new bound function.`},{name:`IIFE`,level:`advanced`,summary:`Immediately Invoked Function Expression — creates a private scope, the pre-module way to avoid leaking globals.`},{name:`Memoization`,level:`advanced`,summary:`Cache a pure function's return value by its arguments to skip recomputation.`},{name:`Generators (function* / yield)`,level:`advanced`,summary:`A function that can pause and resume, yielding a sequence of values lazily instead of computing them all up front.`}]},{id:`js-classes`,name:`Classes & Prototypes`,items:[{name:`class / constructor`,level:`beginner`,summary:`Blueprint for creating objects with shared methods.`},{name:`extends / super`,level:`intermediate`,summary:`Inheritance; super calls the parent constructor/method.`},{name:`Getters/setters`,level:`intermediate`,summary:`get/set define computed properties that read like plain fields.`},{name:`Static members`,level:`intermediate`,summary:`Belong to the class itself, not instances — e.g. factory methods, constants.`},{name:`Prototype chain`,level:`advanced`,summary:`Every object has an internal link to another object it delegates lookups to; classes are sugar over this.`},{name:`Private fields (#field)`,level:`advanced`,summary:`True encapsulation enforced by the engine, unlike the old _underscore convention.`},{name:`Mixins`,level:`advanced`,summary:`Compose behavior from multiple sources into a class since JS only allows single inheritance.`},{name:`Symbol.hasInstance`,level:`advanced`,summary:`Customize what instanceof checks — rarely needed, but explains how instanceof actually works.`}]},{id:`js-iteration`,name:`Iterators & Generators`,items:[{name:`for...of`,level:`intermediate`,summary:`Iterates values directly — vs. for...in, which iterates enumerable keys including inherited ones, the classic footgun.`},{name:`Symbol.iterator protocol`,level:`advanced`,summary:`Implement it to make your own class work with for...of and spread.`,deepDiveId:`js-iterator-protocol`},{name:`yield*`,level:`advanced`,summary:`Delegate to another generator/iterable from within a generator.`}]},{id:`js-json`,name:`JSON`,items:[{name:`JSON.stringify(obj)`,level:`beginner`,summary:`Serialize a value to a JSON string.`},{name:`JSON.parse(str)`,level:`beginner`,summary:`Parse a JSON string back into a value.`},{name:`stringify/parse replacer & reviver`,level:`advanced`,summary:`Second argument lets you transform values during (de)serialization — e.g. to handle Dates or filter fields.`}]}]},{id:`python`,name:`Python`,tagline:`Lists, dicts, comprehensions, generators, and the standard library.`,categories:[{id:`py-lists`,name:`Lists`,items:[{name:`append(item)`,level:`beginner`,summary:`Add one item to the end (mutates).`},{name:`pop(i=-1)`,level:`beginner`,summary:`Remove & return the item at index i (default: last).`},{name:`insert(i, item)`,level:`beginner`,summary:`Insert item at index i (mutates).`},{name:`remove(item)`,level:`beginner`,summary:`Remove the first matching value; raises ValueError if absent.`},{name:`index(item) / count(item)`,level:`beginner`,summary:`First index of item (raises if absent), or how many times it appears.`},{name:`sort(key=None, reverse=False)`,level:`beginner`,summary:`In-place, stable sort. Use sorted() for a new list instead.`},{name:`reverse()`,level:`beginner`,summary:`Reverse in place.`},{name:`Slicing lst[a:b:step]`,level:`beginner`,summary:`Extract a sub-list; supports negative indices/steps, never mutates.`},{name:`List comprehension [x for x in it if cond]`,level:`intermediate`,summary:`Build a list in one expression.`},{name:`sorted(iterable, key=..., reverse=...)`,level:`intermediate`,summary:`New sorted list, non-mutating, stable, works on any iterable.`},{name:`enumerate(iterable)`,level:`intermediate`,summary:`Pairs (index, value) while iterating.`},{name:`zip(*iterables)`,level:`intermediate`,summary:`Iterate multiple sequences in lockstep; stops at the shortest.`},{name:"Star-unpacking `a, *rest = lst`",level:`intermediate`,summary:`Captures the remainder into a list.`},{name:`bisect module (bisect_left / insort)`,level:`advanced`,summary:`Binary-search the insertion point in a sorted list in O(log n).`},{name:`list.pop(0) vs. collections.deque.popleft()`,level:`advanced`,summary:`Removing from the front of a list is O(n); a deque does it in O(1).`}]},{id:`py-strings`,name:`Strings`,items:[{name:`f-strings f"{x}"`,level:`beginner`,summary:`Embed expressions directly in a string literal.`},{name:`split() / join()`,level:`beginner`,summary:`Break a string apart on a separator, or glue an iterable back together.`},{name:`strip() / lstrip() / rstrip()`,level:`beginner`,summary:`Remove whitespace (or given characters) from ends.`},{name:`upper() / lower()`,level:`beginner`,summary:`Case conversion.`},{name:`replace(old, new)`,level:`beginner`,summary:`Replace all occurrences of a substring.`},{name:`startswith() / endswith()`,level:`intermediate`,summary:`Prefix/suffix check, optionally over a tuple of options.`},{name:`isdigit() / isalpha() / isalnum()`,level:`intermediate`,summary:`Character-class checks.`},{name:`Slicing s[a:b:step]`,level:`intermediate`,summary:`Same slicing rules as lists — strings are sequences too.`},{name:`re module (match / search / findall / sub)`,level:`advanced`,summary:`Regular expressions for pattern matching and substitution.`},{name:`str.translate + str.maketrans`,level:`advanced`,summary:`Fast bulk character replacement/deletion via a translation table.`}]},{id:`py-dicts-sets`,name:`Dicts & Sets`,items:[{name:`dict.get(key, default)`,level:`beginner`,summary:`Read with a fallback instead of raising KeyError.`},{name:`dict.keys() / values() / items()`,level:`beginner`,summary:`Views over a dict's keys, values, or (key, value) pairs.`},{name:`dict.setdefault(key, default) / update(other)`,level:`beginner`,summary:`Insert-if-missing, or bulk-merge another mapping in.`},{name:`set add() / remove() / union() / intersection() / difference()`,level:`beginner`,summary:`Core set operations, each with an operator form too (| & -).`},{name:`Dict comprehension {k: v for ...}`,level:`intermediate`,summary:`Build a dict in one expression.`},{name:`Insertion-order guarantee (3.7+)`,level:`intermediate`,summary:`Dicts preserve insertion order as a language guarantee, not an implementation detail.`},{name:`collections.defaultdict(factory)`,level:`intermediate`,summary:`Auto-initializes missing keys via factory() instead of raising KeyError.`},{name:`collections.Counter`,level:`intermediate`,summary:`Frequency counting / multiset, with a .most_common() method.`},{name:`frozenset`,level:`advanced`,summary:`Immutable, hashable set — usable as a dict key or set member, unlike a regular set.`}]},{id:`py-numbers`,name:`Numbers & Math`,items:[{name:`// and %`,level:`beginner`,summary:`Floor division and modulo.`},{name:`round(x, n)`,level:`beginner`,summary:`Rounds half-to-even (banker's rounding) — round(2.5) is 2, not 3, a common surprise.`},{name:`math module (sqrt, floor, ceil, log)`,level:`beginner`,summary:`Standard math functions on floats.`},{name:`int() / float() conversions`,level:`beginner`,summary:`Explicit type conversion between numeric types and strings.`},{name:`Arbitrary-precision integers`,level:`intermediate`,summary:`Python ints have no fixed bit width and never silently overflow, unlike most languages.`},{name:`decimal.Decimal`,level:`advanced`,summary:`Exact base-10 arithmetic, avoiding binary-float rounding error (e.g. for money).`},{name:`fractions.Fraction`,level:`advanced`,summary:`Exact rational arithmetic.`}]},{id:`py-comprehensions`,name:`Comprehensions & Generators`,items:[{name:`List/set/dict comprehensions`,level:`intermediate`,summary:`One-line construction with an optional filter clause.`},{name:`Generator expression (x for x in it)`,level:`intermediate`,summary:`Lazy version of a list comprehension — no intermediate list is built.`},{name:`yield / generator functions`,level:`advanced`,summary:`A function that pauses and resumes, producing a lazy sequence of values.`},{name:`yield from`,level:`advanced`,summary:`Delegate iteration to a sub-generator or iterable.`},{name:`itertools (chain, product, combinations, permutations, groupby)`,level:`advanced`,summary:`Composable building blocks for iterator pipelines.`}]},{id:`py-functions`,name:`Functions & Decorators`,items:[{name:`*args / **kwargs`,level:`beginner`,summary:`Collect extra positional or keyword arguments.`},{name:`Default arguments`,level:`beginner`,summary:`Evaluated once at def time — a mutable default (e.g. []) is a classic shared-state bug.`},{name:`lambda`,level:`beginner`,summary:`Anonymous single-expression function.`},{name:`Closures`,level:`intermediate`,summary:`An inner function that remembers variables from its enclosing scope.`},{name:`functools.reduce(fn, iterable, init)`,level:`intermediate`,summary:`Fold an iterable down to a single value.`},{name:`Decorators (@decorator)`,level:`advanced`,summary:`A function that wraps another function to add behavior without changing its source.`},{name:`functools.wraps`,level:`advanced`,summary:`Preserve the wrapped function's __name__/docstring when writing a decorator.`},{name:`functools.lru_cache`,level:`advanced`,summary:`Built-in memoization decorator — caches a pure function's results by argument.`}]},{id:`py-classes`,name:`Classes & OOP`,items:[{name:`class / __init__ / self`,level:`beginner`,summary:`Constructor and the explicit instance reference every method receives.`},{name:`Inheritance / super()`,level:`intermediate`,summary:`Extend a parent class; super() calls the parent's implementation.`},{name:`Dunder methods (__str__, __eq__, __len__)`,level:`intermediate`,summary:`Make your objects work with built-ins: str(), ==, len(), etc.`},{name:`@property`,level:`intermediate`,summary:`Expose a method as a computed attribute (read like a field, runs code).`},{name:`@staticmethod / @classmethod`,level:`intermediate`,summary:`Methods that don't need an instance, or that receive the class instead of self.`},{name:`Multiple inheritance & MRO`,level:`advanced`,summary:`Method Resolution Order (C3 linearization) decides which parent's method wins on conflict.`},{name:`__slots__`,level:`advanced`,summary:`Restrict which instance attributes are allowed, saving memory and disallowing typos-as-new-attrs.`},{name:`abc module (abstract base classes)`,level:`advanced`,summary:`Define an interface that subclasses are forced to implement.`}]},{id:`py-context`,name:`Iterators & Context Managers`,items:[{name:`with statement`,level:`intermediate`,summary:`Guarantees cleanup (e.g. closing a file) even if the block raises.`},{name:`__iter__ / __next__ protocol`,level:`advanced`,summary:`Implement these to make your own class work with for-loops.`},{name:`contextlib.contextmanager`,level:`advanced`,summary:`Write a context manager as a generator function instead of a class with __enter__/__exit__.`}]},{id:`py-exceptions`,name:`Exceptions`,items:[{name:`try / except / else / finally`,level:`beginner`,summary:`else runs only if no exception was raised; finally always runs.`},{name:`raise`,level:`beginner`,summary:`Trigger an exception, optionally re-raising the current one.`},{name:`Custom exception classes`,level:`intermediate`,summary:`Subclass Exception to create domain-specific error types.`},{name:`except SomeError as e`,level:`intermediate`,summary:`Bind the caught exception to a name for inspection.`},{name:`Bare except:`,level:`intermediate`,summary:`Also catches KeyboardInterrupt/SystemExit — almost always prefer except Exception.`}]},{id:`py-stdlib`,name:`Standard Library Highlights`,items:[{name:`collections.deque`,level:`intermediate`,summary:`Double-ended queue with O(1) append/pop from both ends.`},{name:`collections.namedtuple`,level:`intermediate`,summary:`Lightweight immutable record type with named fields.`},{name:`dataclasses.dataclass`,level:`advanced`,summary:`Decorator that auto-generates __init__/__repr__/__eq__ for a class of fields.`},{name:`heapq`,level:`advanced`,summary:`Min-heap operations on top of a plain list — heappush/heappop.`},{name:`typing module (type hints)`,level:`intermediate`,summary:`Optional static type annotations, checked by external tools (mypy), not the interpreter.`}]}]},{id:`java`,name:`Java`,tagline:`Collections, streams, generics, and the object model.`,categories:[{id:`java-collections`,name:`Collections`,items:[{name:`ArrayList: add / get / remove / size`,level:`beginner`,summary:`Resizable array-backed list.`},{name:`HashMap: put / get / containsKey / remove`,level:`beginner`,summary:`Hash table-backed key-value store, O(1) average access.`},{name:`HashSet: add / contains / remove`,level:`beginner`,summary:`Hash table-backed set of unique elements.`},{name:`List.of() / Map.of()`,level:`intermediate`,summary:`Immutable factory collections (Java 9+) — mutating them throws UnsupportedOperationException.`},{name:`Collections.sort(list, comparator)`,level:`intermediate`,summary:`Sort a list in place with a custom Comparator.`},{name:`Iterator / ListIterator`,level:`intermediate`,summary:`Remove elements safely while iterating — mutating the list directly throws ConcurrentModificationException.`},{name:`TreeMap / TreeSet`,level:`advanced`,summary:`Sorted map/set backed by a red-black tree — O(log n) operations, keys iterate in order.`},{name:`LinkedHashMap`,level:`advanced`,summary:`Preserves insertion order (or access order, useful for building an LRU cache).`},{name:`PriorityQueue`,level:`advanced`,summary:`Min-heap by default; pass a Comparator for a max-heap or custom ordering.`},{name:`ArrayDeque`,level:`advanced`,summary:`Resizable array implementing both stack and queue interfaces — faster than LinkedList for most uses.`}]},{id:`java-strings`,name:`Strings`,items:[{name:`length() / charAt() / substring()`,level:`beginner`,summary:`Core string access methods.`},{name:`.equals() vs. ==`,level:`beginner`,summary:`== compares references; .equals() compares content — the classic Java string gotcha.`},{name:`split() / String.join()`,level:`beginner`,summary:`Break a string apart, or glue pieces back together with a separator.`},{name:`trim() vs. strip()`,level:`beginner`,summary:`strip() (Java 11+) is Unicode-aware; trim() only strips ASCII whitespace.`},{name:`String.format()`,level:`intermediate`,summary:`printf-style string formatting.`},{name:`StringBuilder`,level:`intermediate`,summary:`Mutable string buffer — avoids the O(n²) cost of repeated String concatenation in a loop.`},{name:`Text blocks """..."""`,level:`advanced`,summary:`Multi-line string literals (Java 15+), no manual \\n or concatenation needed.`}]},{id:`java-streams`,name:`Streams (Java 8+)`,items:[{name:`stream() / collect(Collectors.toList())`,level:`intermediate`,summary:`Turn a collection into a Stream pipeline, then materialize the result.`},{name:`map / filter / reduce`,level:`intermediate`,summary:`Core stream transformations — lazy until a terminal operation runs them.`},{name:`Collectors.joining()`,level:`intermediate`,summary:`Concatenate stream elements into a single String, with an optional delimiter.`},{name:`Arrays.stream() / Stream.of()`,level:`intermediate`,summary:`Build a Stream from an array or explicit values.`},{name:`IntStream.range(a, b)`,level:`intermediate`,summary:`Primitive int stream, avoids boxing overhead for numeric loops.`},{name:`Collectors.groupingBy()`,level:`advanced`,summary:`Partition stream elements into a Map<K, List<V>> by a classifier function.`},{name:`Parallel streams`,level:`advanced`,summary:`.parallelStream() splits work across threads — only worth it for large, CPU-bound, stateless operations.`}]},{id:`java-generics`,name:`Generics`,items:[{name:`Generic classes <T>`,level:`intermediate`,summary:`Write a class/method once, parameterized over a type.`},{name:`Bounded type parameters <T extends Comparable<T>>`,level:`advanced`,summary:`Restrict T to types that support a given operation.`},{name:`Wildcards ? extends / ? super`,level:`advanced`,summary:`PECS: Producer Extends, Consumer Super — governs which wildcard to use in method signatures.`},{name:`Type erasure`,level:`advanced`,summary:"Generic type info doesn't exist at runtime — you can't do `new T()` or create a `T[]` directly."}]},{id:`java-oop`,name:`OOP & Classes`,items:[{name:`@Override`,level:`beginner`,summary:`Compiler-checked annotation confirming a method actually overrides a superclass/interface method.`},{name:`Static vs. instance members`,level:`beginner`,summary:`Static belongs to the class itself; instance members belong to each object.`},{name:`Interfaces vs. abstract classes`,level:`intermediate`,summary:`A class can implement many interfaces but extend only one (abstract) class.`},{name:`equals() / hashCode() contract`,level:`advanced`,summary:`Must override both together — equal objects need equal hash codes or HashMap/HashSet break silently.`},{name:`Records (Java 16+)`,level:`advanced`,summary:`Immutable data carrier class — auto-generates constructor, accessors, equals/hashCode/toString.`},{name:`Sealed classes (Java 17+)`,level:`advanced`,summary:`Restrict which classes are allowed to extend/implement a type.`}]},{id:`java-exceptions`,name:`Exceptions`,items:[{name:`try / catch / finally`,level:`beginner`,summary:`finally runs whether or not an exception was thrown.`},{name:`Checked vs. unchecked exceptions`,level:`intermediate`,summary:`Checked exceptions must be declared (throws) or caught; unchecked (RuntimeException) don't.`},{name:`try-with-resources`,level:`intermediate`,summary:`Auto-closes any AutoCloseable resource, even if the block throws.`},{name:`Custom exception classes`,level:`intermediate`,summary:`Extend Exception or RuntimeException for domain-specific errors.`}]},{id:`java-concurrency`,name:`Concurrency`,items:[{name:`Thread / Runnable`,level:`intermediate`,summary:`Basic unit of concurrent execution.`},{name:`synchronized keyword`,level:`advanced`,summary:`Mutual-exclusion lock on a method or block to prevent concurrent access to shared state.`},{name:`volatile keyword`,level:`advanced`,summary:`Guarantees visibility of writes across threads — not atomicity.`},{name:`ExecutorService`,level:`advanced`,summary:`Manage a thread pool instead of creating raw Thread objects by hand.`},{name:`CompletableFuture`,level:`advanced`,summary:`Compose asynchronous operations with chained callbacks, similar in spirit to JS Promises.`}]},{id:`java-functional`,name:`Functional Interfaces & Optional`,items:[{name:`Lambda expressions`,level:`intermediate`,summary:`Concise syntax for an anonymous implementation of a functional interface.`},{name:`Method references (Class::method)`,level:`intermediate`,summary:`Shorthand for a lambda that just calls an existing method.`},{name:`Function, Predicate, Supplier, Consumer`,level:`intermediate`,summary:`The core built-in functional interfaces in java.util.function.`},{name:`Optional<T>`,level:`advanced`,summary:`Explicit 'may be absent' wrapper to avoid null, with .map/.orElse/.ifPresent.`}]},{id:`java-numbers`,name:`Numbers & Autoboxing`,items:[{name:`Wrapper classes: Integer.parseInt() / valueOf()`,level:`beginner`,summary:`Convert between primitives, wrapper objects, and Strings.`},{name:`Autoboxing / unboxing (int <-> Integer)`,level:`intermediate`,summary:`Automatic conversion between a primitive and its wrapper class.`},{name:`Integer caching (-128 to 127)`,level:`advanced`,summary:`Integer == comparison happens to work for small cached values, then silently breaks above 127 — use .equals() instead.`}]}]},{id:`c`,name:`C`,tagline:`Pointers, memory management, and the standard library.`,categories:[{id:`c-pointers`,name:`Pointers & Memory`,items:[{name:"Declaring a pointer `int *p`",level:`beginner`,summary:`p holds the address of an int.`},{name:`& (address-of) / * (dereference)`,level:`beginner`,summary:`& gets an address; * reads/writes the value at an address.`},{name:`malloc / free`,level:`beginner`,summary:`Manual heap allocation — every malloc needs exactly one matching free.`},{name:`NULL pointer checks`,level:`beginner`,summary:`malloc returns NULL on failure; dereferencing NULL is undefined behavior.`},{name:`calloc`,level:`intermediate`,summary:`Like malloc but zero-initializes the allocated memory.`},{name:`realloc`,level:`intermediate`,summary:`Resize a previously allocated block — may move it, so always reassign the returned pointer.`},{name:`Pointer arithmetic`,level:`intermediate`,summary:`p + 1 advances by sizeof(*p) bytes, not 1 byte.`},{name:`Function pointers`,level:`advanced`,summary:`Store/pass a function as a value, e.g. for callbacks or a dispatch table.`},{name:`void*`,level:`advanced`,summary:`Generic pointer type — must be cast to a concrete type before dereferencing.`},{name:`Dangling pointers / use-after-free`,level:`advanced`,summary:`Undefined behavior from accessing memory after it's been freed.`},{name:`Double free`,level:`advanced`,summary:`Undefined behavior, a common cause of heap corruption.`}]},{id:`c-arrays-strings`,name:`Arrays & Strings`,items:[{name:"Array declaration `int arr[10]`",level:`beginner`,summary:`Fixed-size, stack-allocated (at this scope) block of 10 ints.`},{name:`C-strings & the null terminator`,level:`beginner`,summary:`A string is a char array ending in '\\0'; forgetting it is a classic buffer-overrun cause.`},{name:`strlen / strcpy / strcat / strcmp`,level:`beginner`,summary:`Core string.h functions — none of them bounds-check the destination buffer.`},{name:`Arrays decay to pointers`,level:`intermediate`,summary:`Passing an array to a function passes a pointer, losing size info — sizeof inside that function returns pointer size, not array size.`},{name:`strncpy / strncat / snprintf`,level:`intermediate`,summary:`Bounded variants that avoid overflowing the destination buffer.`},{name:`2D arrays vs. array of pointers`,level:`advanced`,summary:`int arr[R][C] is one contiguous block; int *arr[R] is R separate allocations — very different memory layouts.`}]},{id:`c-structs`,name:`Structs & Unions`,items:[{name:`struct definition`,level:`beginner`,summary:`Group related fields into one named type.`},{name:`Member access: . vs. ->`,level:`beginner`,summary:`. for a struct value, -> for a pointer to a struct (sugar for (*p).field).`},{name:`typedef`,level:`beginner`,summary:`Give an existing type a new name, commonly used to drop the 'struct' keyword at use sites.`},{name:`Nested structs`,level:`intermediate`,summary:`A struct field can itself be another struct type.`},{name:`union`,level:`advanced`,summary:`All members share the same memory; only one is valid to read at a time.`},{name:`Struct padding/alignment`,level:`advanced`,summary:`The compiler may insert padding between fields for alignment — sizeof(struct) isn't just the sum of member sizes.`}]},{id:`c-stdlib`,name:`Standard Library`,items:[{name:`printf / scanf format specifiers`,level:`beginner`,summary:`%d, %s, %f, %p etc. control how arguments are formatted or parsed.`},{name:`malloc family (stdlib.h)`,level:`beginner`,summary:`malloc/calloc/realloc/free for dynamic memory.`},{name:`atoi / atof / strtol`,level:`intermediate`,summary:`strtol is the safer choice — it reports how much of the string it actually parsed.`},{name:`memcpy / memmove / memset`,level:`intermediate`,summary:`memmove is safe for overlapping regions; memcpy is not (undefined behavior if src/dst overlap).`},{name:`qsort`,level:`advanced`,summary:`Generic in-place sort taking a comparator function pointer — the C ancestor of Array.sort/Collections.sort.`}]},{id:`c-preprocessor`,name:`Preprocessor & Compilation`,items:[{name:`#include`,level:`beginner`,summary:`Textually pastes a header file's contents before compilation.`},{name:`#define macros`,level:`beginner`,summary:`Text substitution before compilation, not a real function call — no type checking.`},{name:`Header guards (#ifndef / #define / #endif)`,level:`intermediate`,summary:`Prevent a header from being included twice in the same translation unit.`},{name:`const correctness`,level:`intermediate`,summary:`Mark data (or a pointer's target) as read-only, checked at compile time.`},{name:`static (file scope vs. persistent local)`,level:`advanced`,summary:`Two meanings depending on context: limits linkage to the file, or makes a local variable's value persist across calls.`},{name:`extern`,level:`advanced`,summary:`Declare a variable/function that's actually defined in another translation unit.`}]},{id:`c-functions`,name:`Functions`,items:[{name:`Pass-by-value semantics`,level:`beginner`,summary:`C always passes by value; to 'pass by reference' you explicitly pass a pointer.`},{name:`Recursion`,level:`beginner`,summary:`A function calling itself; each call gets its own stack frame.`},{name:`Variadic functions (stdarg.h)`,level:`advanced`,summary:`printf-style functions that accept a variable number of arguments.`},{name:`inline`,level:`advanced`,summary:`Hint to the compiler to substitute the function body at the call site instead of a real call.`}]},{id:`c-bitwise`,name:`Bitwise Operations`,items:[{name:`& | ^ ~`,level:`beginner`,summary:`AND, OR, XOR, NOT at the bit level.`},{name:`<< >>`,level:`beginner`,summary:`Shift left/right; right-shift on a signed negative number is implementation-defined.`},{name:`Bit masks`,level:`intermediate`,summary:`Use & and | to read or set individual bits/flags packed into an integer.`},{name:`XOR swap`,level:`advanced`,summary:`Swap two integers without a temp variable — rarely needed, but a classic interview trick.`}]},{id:`c-file-io`,name:`File I/O`,items:[{name:`fopen / fclose`,level:`beginner`,summary:`Open and close a file handle (FILE*).`},{name:`File modes ("r", "w", "a", "rb", ...)`,level:`beginner`,summary:`Control read/write/append and text vs. binary interpretation.`},{name:`fread / fwrite`,level:`intermediate`,summary:`Binary block I/O.`},{name:`fprintf / fscanf`,level:`intermediate`,summary:`Formatted I/O to/from a file, same format specifiers as printf/scanf.`}]}]},{id:`ruby`,name:`Ruby & Rails`,tagline:`Blocks, enumerables, and the Rails conventions built on top.`,categories:[{id:`ruby-enumerable`,name:`Enumerable & Blocks`,items:[{name:`each`,level:`beginner`,summary:`Iterate with a block; returns the original collection.`},{name:`map / collect`,level:`beginner`,summary:`New array built from the block's return values.`},{name:`select / filter`,level:`beginner`,summary:`New array of elements where the block is truthy.`},{name:`reject`,level:`beginner`,summary:`Opposite of select — keeps elements where the block is falsy.`},{name:`reduce / inject`,level:`intermediate`,summary:`Fold to a single value; supports an initial value and a symbol shorthand like reduce(:+).`},{name:`find / detect`,level:`intermediate`,summary:`First element for which the block is truthy.`},{name:`each_with_index`,level:`intermediate`,summary:`Iterate with both element and index.`},{name:`sort_by`,level:`intermediate`,summary:`Sort by a computed key instead of the element itself.`},{name:`yield / block_given?`,level:`intermediate`,summary:`yield calls the block implicitly passed to a method; block_given? checks whether one was.`},{name:`each_with_object(obj)`,level:`advanced`,summary:`Like reduce but accumulates into a passed-in object — handy for building up a hash.`},{name:`group_by`,level:`advanced`,summary:`Partition elements into a Hash keyed by the block's result.`},{name:`Blocks vs. Procs vs. Lambdas`,level:`advanced`,summary:`do...end/{} blocks are implicit; Proc.new is lenient on arity; lambda is strict on arity, and its return only exits the lambda, not the enclosing method.`}]},{id:`ruby-strings`,name:`Strings`,items:[{name:`upcase / downcase / strip`,level:`beginner`,summary:`Case conversion and whitespace trimming.`},{name:`split / join`,level:`beginner`,summary:`Break apart on a separator, or glue back together.`},{name:`String interpolation "#{}"`,level:`beginner`,summary:`Embed expressions directly inside a double-quoted string.`},{name:`include? / start_with? / end_with?`,level:`beginner`,summary:`Substring and prefix/suffix checks.`},{name:`gsub / sub`,level:`beginner`,summary:`gsub replaces every match; sub replaces only the first.`},{name:`%w[] / %i[]`,level:`intermediate`,summary:`Shorthand literals for an array of strings / an array of symbols.`},{name:`<<~HEREDOC`,level:`advanced`,summary:`Squiggly heredoc — strips the common leading indentation from a multi-line string.`}]},{id:`ruby-collections`,name:`Arrays & Hashes`,items:[{name:`push / << / pop / shift / unshift`,level:`beginner`,summary:`Core array mutation methods; << is the idiomatic append operator.`},{name:`Hash#each / keys / values / merge`,level:`beginner`,summary:`Core hash iteration and combination.`},{name:`Array#uniq / flatten / compact`,level:`intermediate`,summary:`Dedupe, flatten nested arrays, or drop nil entries.`},{name:`Array#zip`,level:`intermediate`,summary:`Combine multiple arrays element-wise into an array of arrays.`},{name:`Hash#fetch(key, default)`,level:`intermediate`,summary:`Raises or falls back explicitly, unlike [] which silently returns nil for a missing key.`},{name:`Array#dig / Hash#dig`,level:`advanced`,summary:`Safe nested lookup — returns nil instead of raising on a missing intermediate key.`},{name:"Splat `*` / double-splat `**`",level:`advanced`,summary:`Capture or spread positional (*) or keyword (**) arguments.`}]},{id:`ruby-classes`,name:`Classes & Modules`,items:[{name:`class / initialize`,level:`beginner`,summary:`initialize is Ruby's constructor, run automatically by .new.`},{name:`attr_accessor / attr_reader / attr_writer`,level:`beginner`,summary:`Auto-generate getter/setter methods for instance variables.`},{name:`super`,level:`intermediate`,summary:`Call the parent class's version of the current method.`},{name:`Method visibility (public / private / protected)`,level:`intermediate`,summary:`Controls where a method can be called from.`},{name:`Modules & include (mixins)`,level:`intermediate`,summary:`Share behavior across unrelated classes as instance methods, without inheritance.`},{name:`extend`,level:`advanced`,summary:`Mix a module's methods in as class-level methods instead of instance methods.`},{name:`Comparable module`,level:`advanced`,summary:`Implement <=> once and get <, >, ==, between? for free.`}]},{id:`ruby-symbols-procs`,name:`Symbols, Procs & Lambdas`,items:[{name:`Symbols :name`,level:`beginner`,summary:`Immutable, interned identifiers — lighter-weight than strings, idiomatic for hash keys.`},{name:`Proc.new / proc`,level:`intermediate`,summary:`A block turned into an object you can store and pass around.`},{name:`lambda / ->() {}`,level:`intermediate`,summary:`Like a Proc but strict about argument count, and return only exits the lambda.`},{name:`Symbol#to_proc (&:method_name)`,level:`advanced`,summary:`arr.map(&:upcase) passes a proc that calls .upcase on each element.`}]},{id:`ruby-metaprogramming`,name:`Metaprogramming`,items:[{name:`respond_to?`,level:`intermediate`,summary:`Check whether an object defines a given method before calling it.`},{name:`send`,level:`advanced`,summary:`Call a method by name (string/symbol), bypassing normal visibility rules.`},{name:`define_method`,level:`advanced`,summary:`Define a method dynamically at runtime.`},{name:`method_missing`,level:`advanced`,summary:`Intercept calls to methods that aren't defined — the basis of many Rails/DSL tricks.`}]},{id:`rails-conventions`,name:`Rails Conventions`,items:[{name:`MVC structure (app/models, app/views, app/controllers)`,level:`beginner`,summary:`Rails' default separation of data, presentation, and request handling.`},{name:`Convention over configuration`,level:`beginner`,summary:`e.g. a Post model maps to a posts table automatically — no config needed for the common case.`},{name:`rails generate / rails g`,level:`beginner`,summary:`Scaffolding commands for models, controllers, and migrations.`},{name:`rails console (rails c)`,level:`beginner`,summary:`Interactive REPL with your app's models and environment loaded.`}]},{id:`rails-activerecord`,name:`ActiveRecord`,items:[{name:`ActiveRecord::Base models`,level:`beginner`,summary:`Each model maps to a database table; each instance to a row.`},{name:`find / find_by / where`,level:`beginner`,summary:`Core query methods — find by primary key, by condition, or a filtered relation.`},{name:`has_many / belongs_to / has_one`,level:`intermediate`,summary:`Association macros that generate methods for related records.`},{name:`validates`,level:`intermediate`,summary:`Declarative model validations (presence, uniqueness, etc.) that run before save.`},{name:`has_many :through`,level:`advanced`,summary:`Many-to-many association via an explicit join model.`},{name:`Callbacks (before_save, after_create, ...)`,level:`advanced`,summary:`Hook custom logic into a record's save/create/update/destroy lifecycle.`},{name:`Scopes`,level:`advanced`,summary:`Named, chainable query fragments defined on the model.`},{name:`N+1 queries & .includes`,level:`advanced`,summary:`Eager-load associations with .includes to avoid firing one extra query per record.`}]},{id:`rails-routing-migrations`,name:`Routing & Migrations`,items:[{name:`config/routes.rb`,level:`beginner`,summary:`Central file mapping URLs + HTTP verbs to controller actions.`},{name:`resources :posts`,level:`beginner`,summary:`Generates the full RESTful route set (index/show/new/create/edit/update/destroy) in one line.`},{name:`rails db:migrate / rollback`,level:`beginner`,summary:`Apply or undo pending schema migrations.`},{name:`Nested routes`,level:`intermediate`,summary:`Scope child resources under a parent, e.g. posts/:post_id/comments.`},{name:`db/schema.rb`,level:`intermediate`,summary:`Auto-generated snapshot of the current database schema, checked into version control.`}]}]},{id:`sql`,name:`SQL`,tagline:`Joins, aggregates, window functions, indexing.`,categories:[{id:`sql-querying`,name:`Querying`,items:[{name:`SELECT / FROM / WHERE`,level:`beginner`,summary:`Pick columns, name the table, filter rows.`},{name:`ORDER BY`,level:`beginner`,summary:`Sort result rows, ASC (default) or DESC.`},{name:`LIMIT / OFFSET`,level:`beginner`,summary:`Cap the number of rows returned, optionally skipping some for pagination.`},{name:`DISTINCT`,level:`beginner`,summary:`Remove duplicate rows from the result.`},{name:`LIKE / wildcards (%, _)`,level:`beginner`,summary:`Pattern-match text; % is any-length wildcard, _ is single-character.`},{name:`BETWEEN / IN`,level:`beginner`,summary:`Range check, or match against a list of values.`},{name:`IS NULL / IS NOT NULL`,level:`intermediate`,summary:`= NULL never matches anything — null comparisons require IS NULL.`},{name:`CASE WHEN`,level:`intermediate`,summary:`Inline conditional logic inside a SELECT expression.`}]},{id:`sql-joins`,name:`Joins`,items:[{name:`INNER JOIN`,level:`beginner`,summary:`Only rows with a match in both tables.`},{name:`LEFT JOIN / RIGHT JOIN`,level:`intermediate`,summary:`All rows from one side, matched rows (or NULLs) from the other.`},{name:`FULL OUTER JOIN`,level:`intermediate`,summary:`All rows from both sides, NULL-filled where there's no match.`},{name:`CROSS JOIN`,level:`advanced`,summary:`Cartesian product — every row of one table paired with every row of another.`},{name:`Self join`,level:`advanced`,summary:`Join a table to itself, e.g. to compare rows or walk a parent/child relationship.`}]},{id:`sql-aggregation`,name:`Aggregation & Grouping`,items:[{name:`COUNT / SUM / AVG / MIN / MAX`,level:`beginner`,summary:`Core aggregate functions.`},{name:`GROUP BY`,level:`beginner`,summary:`Collapse rows sharing a key into one row per group for aggregation.`},{name:`HAVING vs. WHERE`,level:`intermediate`,summary:`WHERE filters rows before grouping; HAVING filters groups after aggregation.`},{name:`Window functions (OVER, PARTITION BY)`,level:`advanced`,summary:`Compute a value across a set of related rows without collapsing them, unlike GROUP BY.`},{name:`RANK() / ROW_NUMBER() / DENSE_RANK()`,level:`advanced`,summary:`Ranking window functions — differ in how they handle ties.`}]},{id:`sql-subqueries`,name:`Subqueries & CTEs`,items:[{name:`Subquery in WHERE`,level:`intermediate`,summary:`Nest a query inside another to filter by a computed set of values.`},{name:`Correlated subquery`,level:`advanced`,summary:`References a column from the outer query — re-evaluated once per outer row.`},{name:`CTE (WITH clause)`,level:`advanced`,summary:`Name a subquery for readability and reuse within one statement.`},{name:`Recursive CTE`,level:`advanced`,summary:`Traverse hierarchical/graph data (e.g. an org chart) in pure SQL.`}]},{id:`sql-indexes`,name:`Indexes & Performance`,items:[{name:`What an index is`,level:`intermediate`,summary:`A separate sorted structure (usually a B-tree) letting the DB find rows without scanning the whole table.`},{name:`PRIMARY KEY / UNIQUE auto-index`,level:`intermediate`,summary:`These constraints automatically create a backing index.`},{name:`EXPLAIN / EXPLAIN ANALYZE`,level:`advanced`,summary:`Show the query planner's chosen execution plan, and (with ANALYZE) actual runtime stats.`},{name:`Composite indexes & column order`,level:`advanced`,summary:`Leftmost-prefix rule: an index on (a, b) helps queries filtering on a, or a and b, but not b alone.`},{name:`N+1 query problem`,level:`advanced`,summary:`Firing one query per row in a loop instead of one query for the whole set — the most common ORM performance bug.`}]},{id:`sql-transactions`,name:`Transactions`,items:[{name:`BEGIN / COMMIT / ROLLBACK`,level:`intermediate`,summary:`Group statements into an all-or-nothing unit of work.`},{name:`ACID properties`,level:`intermediate`,summary:`Atomicity, Consistency, Isolation, Durability — the guarantees a transaction provides.`},{name:`Isolation levels`,level:`advanced`,summary:`READ COMMITTED, REPEATABLE READ, SERIALIZABLE trade consistency guarantees for concurrency.`}]},{id:`sql-schema`,name:`Schema (DDL)`,items:[{name:`CREATE TABLE`,level:`beginner`,summary:`Define a table's columns and types.`},{name:`PRIMARY KEY / FOREIGN KEY`,level:`beginner`,summary:`Uniquely identify a row, and reference a row in another table.`},{name:`ALTER TABLE`,level:`intermediate`,summary:`Add, remove, or modify columns/constraints on an existing table.`},{name:`Normalization (1NF / 2NF / 3NF)`,level:`advanced`,summary:`Structure tables to reduce redundancy and avoid update anomalies.`}]}]},{id:`nosql`,name:`NoSQL`,tagline:`Document, key-value, and wide-column data modeling.`,categories:[{id:`nosql-modeling`,name:`Data Modeling Concepts`,items:[{name:`Schema-less / dynamic schema`,level:`beginner`,summary:`Documents in the same collection don't need identical fields.`},{name:`Denormalization`,level:`beginner`,summary:`Duplicate data across documents to avoid joins, trading storage for read speed.`},{name:`Embedding vs. referencing`,level:`intermediate`,summary:`Embed related data in one document for fast reads, or reference by ID like a foreign key.`},{name:`Aggregate/document as the unit of consistency`,level:`advanced`,summary:`Operations on a single document are atomic; across documents usually aren't, shaping how you model data.`}]},{id:`nosql-documents`,name:`Document Stores`,items:[{name:`Collections & documents`,level:`beginner`,summary:`A collection is like a table; a document is like a row, but nested/flexible (MongoDB-style).`},{name:`find() / insertOne() / updateOne() / deleteOne()`,level:`beginner`,summary:`Core CRUD operations.`},{name:`Query operators ($gt, $in, $exists)`,level:`intermediate`,summary:`Comparison and existence operators used inside query filters.`},{name:`Indexes on document fields`,level:`intermediate`,summary:`Same purpose as a SQL index — speed up lookups on frequently-queried fields.`},{name:`Aggregation pipeline ($match, $group, $project)`,level:`advanced`,summary:`A chain of stages transforming documents — the document-store answer to SQL's GROUP BY/JOIN.`}]},{id:`nosql-kv-wide`,name:`Key-Value & Wide-Column`,items:[{name:`Key-value stores (Redis-style)`,level:`beginner`,summary:`Simple get/set by key, extremely fast — often used for caching/sessions.`},{name:`TTL / expiring keys`,level:`intermediate`,summary:`Automatically evict a key after a set duration — the basis of cache expiry.`},{name:`Wide-column stores (Cassandra-style)`,level:`advanced`,summary:`Rows can have different columns; data is partitioned by a row key across nodes.`},{name:`Partition key design`,level:`advanced`,summary:`Choosing a key that distributes load evenly is the central design decision in wide-column stores.`}]},{id:`nosql-consistency`,name:`Consistency Models`,items:[{name:`CAP theorem`,level:`intermediate`,summary:`Under a network partition, a system must choose Consistency or Availability, not both.`},{name:`Eventual consistency`,level:`intermediate`,summary:`Replicas converge to the same value over time, not instantly.`},{name:`Strong vs. eventual consistency trade-offs`,level:`advanced`,summary:`Strong consistency costs latency/availability; eventual consistency risks briefly stale reads.`}]}]},{id:`postgresql`,name:`PostgreSQL`,tagline:`Postgres-specific features on top of standard SQL.`,categories:[{id:`pg-types`,name:`Postgres-Specific Types`,items:[{name:`SERIAL / IDENTITY`,level:`beginner`,summary:`Auto-incrementing integer primary key column.`},{name:`UUID type`,level:`intermediate`,summary:`Native storage for universally unique identifiers, often used as a primary key instead of SERIAL.`},{name:`ENUM type`,level:`intermediate`,summary:`A column restricted to a fixed set of named values, enforced by the database.`},{name:`ARRAY type`,level:`intermediate`,summary:`Store an array directly in a single column instead of a join table.`}]},{id:`pg-json`,name:`JSON / JSONB`,items:[{name:`JSON vs. JSONB`,level:`intermediate`,summary:`JSONB is stored in a binary, indexable format; JSON preserves exact text, whitespace, and key order.`},{name:`-> and ->> operators`,level:`intermediate`,summary:`Extract a JSON field as JSON (->) or as text (->>).`},{name:`@> containment operator`,level:`advanced`,summary:`Test whether one JSONB value contains another — the basis of indexed JSONB queries.`},{name:`jsonb_set`,level:`advanced`,summary:`Update a value at a given path inside a JSONB column without rewriting the whole document.`}]},{id:`pg-indexing`,name:`Indexing`,items:[{name:`B-tree (default)`,level:`beginner`,summary:`Postgres' default index type — good for equality and range queries.`},{name:`Partial index`,level:`advanced`,summary:`Index only rows matching a WHERE condition — smaller and faster than indexing the whole table.`},{name:`GIN index`,level:`advanced`,summary:`Good for indexing JSONB, arrays, and full-text search.`},{name:`GiST index`,level:`advanced`,summary:`Good for geometric and range-type data.`}]},{id:`pg-extensions`,name:`Extensions`,items:[{name:`Common extensions (postgis, uuid-ossp)`,level:`intermediate`,summary:`Postgres' extension system adds capabilities like geospatial types or UUID generation functions.`},{name:`pg_stat_statements`,level:`advanced`,summary:`Tracks execution stats for every query — the key tool for finding slow queries.`},{name:`pgvector`,level:`advanced`,summary:`Vector similarity search extension used for embeddings — the Postgres equivalent of this app's own IndexedDB-based 'Feed the Brain' retrieval.`}]}]},{id:`graphql`,name:`GraphQL`,tagline:`Schemas, resolvers, queries, and mutations.`,categories:[{id:`gql-core`,name:`Core Concepts`,items:[{name:`Single endpoint`,level:`beginner`,summary:`One URL handles all queries/mutations, unlike REST's many endpoints.`},{name:`Client specifies exact fields`,level:`beginner`,summary:`Avoids over-fetching and under-fetching — you get exactly the shape you ask for.`},{name:`Strongly typed schema`,level:`beginner`,summary:`Every field's type is known and validated before a query runs.`}]},{id:`gql-schema`,name:`Schema & Types`,items:[{name:`type / field definitions`,level:`beginner`,summary:`Declare the shape of your data and how fields relate.`},{name:`Scalar types (String, Int, Float, Boolean, ID)`,level:`beginner`,summary:`The built-in leaf types every schema is built from.`},{name:`Nullability (Type!)`,level:`intermediate`,summary:`A trailing ! means the field can never be null in a valid response.`},{name:`Input types`,level:`intermediate`,summary:`Special types used only as mutation/query arguments, not as return types.`},{name:`Interfaces & unions`,level:`advanced`,summary:`Model polymorphic data — a field that can return one of several possible types.`}]},{id:`gql-queries`,name:`Queries & Mutations`,items:[{name:`query`,level:`beginner`,summary:`Read operation — fields execute in parallel.`},{name:`mutation`,level:`beginner`,summary:`Write operation — same syntax as a query, but fields execute sequentially, and it signals a side effect.`},{name:`Variables`,level:`intermediate`,summary:`Parameterize a query instead of string-interpolating values into it.`},{name:`Aliases`,level:`intermediate`,summary:`Rename a field in the response, e.g. to query the same field twice with different arguments.`},{name:`Fragments`,level:`intermediate`,summary:`Reusable named sets of fields shared across multiple queries.`}]},{id:`gql-resolvers`,name:`Resolvers`,items:[{name:`Resolver function per field`,level:`intermediate`,summary:`Each field in the schema has a function that knows how to fetch its own data.`},{name:`N+1 problem in resolvers`,level:`advanced`,summary:`Naive nested resolvers issue one query per parent row — the same footgun as ORM N+1 in SQL.`},{name:`DataLoader / batching`,level:`advanced`,summary:`Batch and cache resolver calls within a single request to solve the N+1 problem.`}]}]},{id:`angular`,name:`Angular`,tagline:`Components, services, RxJS, and dependency injection.`,categories:[{id:`ng-components`,name:`Components & Templates`,items:[{name:`@Component decorator`,level:`beginner`,summary:`Marks a class as an Angular component and attaches its template/styles/selector.`},{name:`Templates (HTML + Angular syntax)`,level:`beginner`,summary:`HTML extended with Angular's binding and directive syntax.`},{name:`Interpolation {{ }}`,level:`beginner`,summary:`Embed a component property's value directly in the template.`},{name:`Property binding [property]`,level:`beginner`,summary:`Bind a DOM element property to a component expression.`},{name:`Event binding (event)`,level:`beginner`,summary:`Call a component method in response to a DOM event.`},{name:`Two-way binding [(ngModel)]`,level:`intermediate`,summary:`Combines property + event binding for form inputs in one syntax.`},{name:`@Input() / @Output()`,level:`intermediate`,summary:`Pass data into a child component, or emit events out to a parent.`},{name:`Standalone components (Angular 14+)`,level:`advanced`,summary:`Components that don't need to be declared in an NgModule.`}]},{id:`ng-di`,name:`Services & Dependency Injection`,items:[{name:`Services & @Injectable`,level:`intermediate`,summary:`Reusable class for shared logic/state, provided via Angular's DI system.`},{name:`Dependency Injection`,level:`intermediate`,summary:`Angular constructs and injects a service's dependencies automatically based on constructor parameter types.`}]},{id:`ng-rxjs`,name:`RxJS & Observables`,items:[{name:`RxJS Observables`,level:`advanced`,summary:`Angular's core async primitive — streams of values over time, composed with operators like map/filter/switchMap.`},{name:`async pipe`,level:`advanced`,summary:`Subscribes to an Observable/Promise directly in the template and auto-unsubscribes when the component is destroyed.`}]},{id:`ng-directives`,name:`Directives & Pipes`,items:[{name:`*ngIf / *ngFor structural directives`,level:`beginner`,summary:`Conditionally render, or repeat, a template element.`},{name:`Pipes ({{ value | date }})`,level:`intermediate`,summary:`Transform a value for display without changing the underlying data.`},{name:`Custom directives`,level:`advanced`,summary:`Attach custom behavior to a DOM element beyond the built-in structural/attribute directives.`}]},{id:`ng-routing`,name:`Routing & Change Detection`,items:[{name:`Angular Router`,level:`intermediate`,summary:`Maps URLs to components, with support for route params, guards, and lazy loading.`},{name:`Route guards (CanActivate)`,level:`advanced`,summary:`Control whether navigation to a route is allowed to proceed.`},{name:`Change detection`,level:`advanced`,summary:`Default strategy checks the whole component tree on every event; OnPush skips subtrees whose @Input references haven't changed.`}]}]},{id:`react`,name:`React`,tagline:`Components, hooks, and the render model.`,categories:[{id:`react-basics`,name:`Components & JSX`,items:[{name:`JSX`,level:`beginner`,summary:`HTML-like syntax that compiles down to React.createElement calls.`},{name:`Function components`,level:`beginner`,summary:`A plain function that returns JSX — the standard way to write components today.`},{name:`props`,level:`beginner`,summary:`Read-only data passed from a parent component to a child.`},{name:`Conditional rendering`,level:`beginner`,summary:`Show different JSX based on a condition, typically with &&  or a ternary.`},{name:`Lists & keys`,level:`beginner`,summary:`key helps React identify which items changed/moved between renders — must be stable, not the array index if the list can reorder.`},{name:`Event handling (onClick, etc.)`,level:`beginner`,summary:`Attach handlers directly as JSX props; React wraps native events in its own SyntheticEvent.`}]},{id:`react-core-hooks`,name:`Core Hooks`,items:[{name:`useState`,level:`beginner`,summary:`Local component state — calling the setter triggers a re-render.`},{name:`useEffect`,level:`beginner`,summary:`Run side effects after render; the dependency array controls when it re-runs.`},{name:`useContext`,level:`intermediate`,summary:`Read a value from a Context Provider without prop drilling through every intermediate component.`},{name:`useRef`,level:`intermediate`,summary:`Mutable value that persists across renders without causing one when it changes; also used for DOM refs.`}]},{id:`react-patterns`,name:`State & Data Flow Patterns`,items:[{name:`Controlled vs. uncontrolled components`,level:`intermediate`,summary:`Controlled: React state drives the input's value. Uncontrolled: the DOM holds it, read via a ref.`},{name:`Lifting state up`,level:`intermediate`,summary:`Move state shared by siblings to their closest common ancestor.`},{name:`Custom hooks`,level:`intermediate`,summary:`Extract reusable stateful logic into a function whose name starts with 'use'.`},{name:`useReducer`,level:`advanced`,summary:`useState alternative for more complex state transitions — a Redux-like reducer pattern, local to one component.`}]},{id:`react-performance`,name:`Rendering & Performance`,items:[{name:`useMemo`,level:`intermediate`,summary:`Memoize an expensive computed value between renders.`},{name:`useCallback`,level:`intermediate`,summary:`Memoize a function reference — avoids re-rendering children that depend on referential equality.`},{name:`React.memo`,level:`advanced`,summary:`Skip re-rendering a component if its props are shallow-equal to last render.`},{name:`Reconciliation / virtual DOM diffing`,level:`advanced`,summary:`React diffs the virtual DOM tree to compute the minimal real-DOM update needed.`}]},{id:`react-advanced`,name:`Advanced Patterns`,items:[{name:`Error boundaries`,level:`advanced`,summary:`Components that catch rendering errors in their child tree and show a fallback instead of crashing the whole app.`},{name:`Suspense`,level:`advanced`,summary:`Declaratively show a fallback while a child is 'not ready' — e.g. lazy-loaded code or async data.`},{name:`Portals`,level:`advanced`,summary:`Render children into a DOM node outside the parent hierarchy — e.g. for modals that escape overflow/z-index constraints.`}]}]},{id:`flutter`,name:`Flutter`,tagline:`Widgets, state management, and Dart.`,categories:[{id:`flutter-widgets`,name:`Widgets Basics`,items:[{name:`Everything is a widget`,level:`beginner`,summary:`Layout, styling, even padding are all widgets composed together into a tree.`},{name:`StatelessWidget`,level:`beginner`,summary:`Immutable widget, rebuilt only when its parent rebuilds it with new data.`},{name:`StatefulWidget / State`,level:`beginner`,summary:`Widget with mutable internal state, split into a widget class and its associated State object.`},{name:`build() method`,level:`beginner`,summary:`Describes the widget tree; called every time the widget needs to rebuild.`},{name:`setState()`,level:`beginner`,summary:`Tells Flutter this widget's state changed and it needs to rebuild.`},{name:`Hot reload`,level:`beginner`,summary:`Injects updated code into a running app while preserving state — Flutter's fast iteration loop.`}]},{id:`flutter-layout`,name:`Layout`,items:[{name:`Column / Row`,level:`beginner`,summary:`Vertical/horizontal layout widgets, analogous to flexbox.`},{name:`Container`,level:`beginner`,summary:`Single-child widget for padding, margin, decoration, and sizing.`},{name:`Expanded / Flexible`,level:`intermediate`,summary:`Control how a child fills the remaining space inside a Row/Column.`},{name:`Stack / Positioned`,level:`intermediate`,summary:`Overlap widgets, positioned absolutely within the stack.`},{name:`ListView.builder`,level:`intermediate`,summary:`Lazily builds list items on demand — efficient for long or infinite lists.`}]},{id:`flutter-state`,name:`State Management`,items:[{name:`InheritedWidget`,level:`advanced`,summary:`Efficiently propagate data down the widget tree — the low-level mechanism many state-management libraries build on.`},{name:`Provider / Riverpod`,level:`advanced`,summary:`Popular state-management packages built on top of InheritedWidget-style propagation.`},{name:`setState scope`,level:`advanced`,summary:`setState only rebuilds the widget it's called in and its descendants — why large widgets get split up for performance.`}]},{id:`flutter-navigation`,name:`Navigation`,items:[{name:`Navigator.push / pop`,level:`intermediate`,summary:`Imperative navigation between screens (routes), maintaining a stack.`}]},{id:`flutter-dart`,name:`Dart Language Essentials`,items:[{name:`Null safety (?, !, late)`,level:`intermediate`,summary:`Types are non-nullable by default; ? marks nullable, ! asserts non-null, late defers initialization.`},{name:`Futures & async/await`,level:`intermediate`,summary:`Same async/await syntax as JS, built on Dart's Future type.`},{name:`Streams`,level:`advanced`,summary:`Dart's async sequence type — commonly consumed with a StreamBuilder in the widget tree.`}]}]}];function C(e){return e.categories.reduce((e,t)=>e+t.items.length,0)}function w(e){let t=S.find(t=>t.id===e);return t?C(t):0}var T=S.reduce((e,t)=>e+C(t),0),E=[{id:`js-sort`,langId:`javascript`,title:`Array.prototype.sort(fn)`,intro:`sort() mutates the array in place and returns the same reference. Without a comparator, every element is converted to a string and compared lexicographically — which is why [10, 2, 1].sort() produces [1, 10, 2], not [1, 2, 10]. A comparator function fixes this: return a negative number to put a before b, positive to put b before a, zero to leave their order unchanged. Since ES2019 the spec guarantees sort() is stable — equal elements keep their original relative order, which matters when you sort by one key after already sorting by another.`,gotchas:[`Default (no-argument) sort always compares as strings — numeric input needs an explicit comparator: arr.sort((a, b) => a - b).`,`sort() mutates the original array. To sort a copy, spread first: [...arr].sort(...) or use toSorted() (ES2023) which returns a new array.`,`A comparator that isn't a strict total order (e.g. returning true/false instead of a number, or being inconsistent) gives undefined behavior in some engines — always return a number.`,`Stability (guaranteed since ES2019) is what makes 'sort by secondary key, then sort by primary key' actually work correctly.`],code:`// Numeric sort — the #1 sort() interview gotcha
[10, 2, 1].sort();                 // ['1', '10', '2']  (string comparison!)
[10, 2, 1].sort((a, b) => a - b);  // [1, 2, 10]         (correct)

// Sort objects by a key
people.sort((a, b) => a.age - b.age);

// Stable multi-key sort: sort by lastName, ties broken by firstName
people.sort((a, b) => a.firstName.localeCompare(b.firstName));
people.sort((a, b) => a.lastName.localeCompare(b.lastName));
// ^ safe because sort() is stable — the firstName order survives within each lastName group

// Non-mutating sort
const sorted = [...arr].sort((a, b) => a - b);  // or arr.toSorted((a, b) => a - b)`,related:[`reduce(fn, init)`,`splice(start, count, ...items)`]},{id:`js-reduce`,langId:`javascript`,title:`Array.prototype.reduce(fn, init)`,intro:`reduce() walks the array left to right, carrying an accumulator forward: at each step it calls fn(accumulator, currentItem, index, array) and the return value becomes the accumulator for the next step. The final accumulator is reduce()'s return value. Because the accumulator can be any shape — a number, an array, an object, a Map — reduce() can express sum, count, group-by, flatten, or even map/filter themselves; it's the most general of the array iteration methods, which is also why overusing it can hurt readability compared to a purpose-built method.`,gotchas:[`Omitting init on an empty array throws a TypeError ('Reduce of empty array with no initial value') — always pass init unless you're certain the array is non-empty.`,`Without init, the first array element is used as the initial accumulator and iteration starts at index 1 — this silently changes indices inside fn versus the init-supplied case.`,`Building up an object/array accumulator without mutating a fresh one each call (e.g. spreading into a new object every iteration) is O(n²) — mutate the same accumulator in place instead.`,`If you only need a boolean/first-match/every-element check, some()/every()/find() are clearer and stop early; reduce() always visits every element.`],code:`// Sum
[1, 2, 3].reduce((sum, n) => sum + n, 0);  // 6

// Group by (accumulator is an object) — mutate acc in place, don't spread per-iteration
const byLevel = items.reduce((acc, item) => {
  (acc[item.level] ??= []).push(item);
  return acc;
}, {});

// Count occurrences (accumulator is a Map)
const counts = words.reduce((acc, w) => acc.set(w, (acc.get(w) ?? 0) + 1), new Map());

// The empty-array trap
[].reduce((a, b) => a + b);        // TypeError: Reduce of empty array with no initial value
[].reduce((a, b) => a + b, 0);      // 0 — safe, because init was supplied`,related:[`sort(fn)`,`map(fn)`,`filter(fn)`]},{id:`js-splice`,langId:`javascript`,title:`Array.prototype.splice(start, deleteCount, ...items)`,intro:`splice() is the one array method that mutates, removes, and inserts all in a single call — every other common array method does at most one of those. It returns an array of the removed elements (empty array if none were removed). start can be negative to count from the end. Because it changes the array's length in place, it's easy to confuse with slice() (which never mutates and only extracts a copy) — the similar name is a well-known source of bugs.`,gotchas:[`splice() mutates the original array; slice() does not. They are not interchangeable despite the near-identical name.`,`Omitting deleteCount removes everything from start to the end of the array, not zero elements.`,`deleteCount: 0 with extra arguments inserts without removing anything: arr.splice(2, 0, 'x') inserts 'x' at index 2.`,`The return value is the removed elements, not the mutated array — a common mistake is chaining off splice()'s return expecting the full array back.`],code:`const arr = ['a', 'b', 'c', 'd', 'e'];

// Remove 2 elements starting at index 1
const removed = arr.splice(1, 2);   // removed = ['b', 'c'], arr is now ['a', 'd', 'e']

// Insert without removing (deleteCount: 0)
arr.splice(1, 0, 'x', 'y');          // arr is now ['a', 'x', 'y', 'd', 'e']

// Replace in place (remove then insert in one call)
arr.splice(0, 1, 'A');               // arr is now ['A', 'x', 'y', 'd', 'e']

// Negative start — counts from the end
arr.splice(-1, 1);                   // removes the last element

// Non-mutating equivalent, if you need the original array untouched
const withoutFirstTwo = [...arr.slice(0, 1), ...arr.slice(3)];`,related:[`sort(fn)`,`slice(start, end)`]},{id:`js-closures`,langId:`javascript`,title:`Closures`,intro:`A closure is what you get whenever a function is defined inside another function and keeps access to that outer function's variables even after the outer function has already returned. JavaScript doesn't garbage-collect those outer variables as long as an inner function still references them. This is the mechanism behind private state without classes (module pattern), memoization caches, and event-handler callbacks that 'remember' the value they were created with — and it's also the root cause of the single most common JS interview gotcha, the var-in-a-loop bug.`,gotchas:["The classic loop bug: `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0)` logs 3, 3, 3 — because var is function-scoped, all three closures share the same i, which is 3 by the time the callbacks run.","The fix is `let` instead of `var` — let is block-scoped, so each loop iteration gets its own binding, and the closures each capture a different i (logs 0, 1, 2).",`Closures capture variables by reference, not by value at creation time — if the outer variable is reassigned later, every closure over it sees the new value.`,`Holding a closure alive (e.g. storing a callback long-term) keeps its entire captured scope alive too — an easy, easy-to-miss memory leak source for large captured objects.`],code:`// The classic bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);  // logs 3, 3, 3
}
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);  // logs 0, 1, 2 — let is block-scoped per iteration
}

// Private state via closure (no class needed)
function makeCounter() {
  let count = 0;                 // not accessible from outside — true privacy
  return {
    increment: () => ++count,
    value: () => count,
  };
}
const counter = makeCounter();
counter.increment(); counter.increment();
counter.value();  // 2 — count itself is unreachable from the outside`,related:[`Arrow functions`,`Higher-order functions`,`IIFE`,`Memoization`]},{id:`js-iterator-protocol`,langId:`javascript`,title:`Symbol.iterator protocol`,intro:`for...of, spread (...), Array.from(), and destructuring all work on any object that implements the iterable protocol — arrays, strings, Maps, and Sets are built-in iterables, but plain objects are not. Implementing it yourself means giving an object a method keyed by the well-known symbol Symbol.iterator, which must return an iterator: an object with a next() method returning { value, done }. This is what actually makes 'iterable' a real, checkable interface in JS rather than a vague description.`,gotchas:["Plain objects are not iterable by default — `for (const x of {a: 1})` throws 'is not iterable'; use Object.entries()/keys()/values() to get an iterable view instead.","Symbol.iterator must return an iterator (an object with next()), not a value directly — a common mistake is implementing next() directly on the object and forgetting the [Symbol.iterator]() wrapper that returns `this`.","A generator function (function*) automatically satisfies the iterator protocol, so `[Symbol.iterator]: function* () { yield ...; }` is usually far less code than hand-writing next()/done.",`Iterables are consumed once per iterator — running two for...of loops over the same custom iterable requires [Symbol.iterator]() to return a *fresh* iterator each call, not a shared, already-exhausted one.`],code:`// Hand-written iterator (verbose form)
const range = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let current = this.from, last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};
[...range];              // [1, 2, 3] — spread works because range is now iterable
for (const n of range) console.log(n);  // for...of works too

// Same thing, far less code, using a generator
const range2 = {
  from: 1, to: 3,
  *[Symbol.iterator]() {
    for (let n = this.from; n <= this.to; n++) yield n;
  },
};`,related:[`for...of`,`Generators (function* / yield)`,`yield*`]},{id:`js-promise-combinators`,langId:`javascript`,title:`Promise.all / allSettled / race / any`,intro:`All four take an array (or iterable) of promises and run them concurrently, but they differ in when they settle and how they handle rejection — a distinction that comes up constantly in interviews because it's easy to reach for all() when allSettled() is what the requirements actually call for.`,gotchas:[`Promise.all() rejects immediately on the FIRST rejection, even if other promises would have succeeded — the successful results are simply discarded, not returned.`,`Promise.allSettled() never rejects — it always resolves, with each entry tagged { status: 'fulfilled', value } or { status: 'rejected', reason }. Use it when partial failure is acceptable and you need every result.`,`Promise.race() settles (fulfilled OR rejected) on whichever promise finishes first — a rejection can win the race just as easily as a fulfillment, which surprises people expecting 'first successful result'.`,`Promise.any() is the one that actually means 'first success': it resolves on the first fulfillment and only rejects if ALL promises reject, bundling the failures into an AggregateError.`],code:`const requests = [fetchA(), fetchB(), fetchC()];  // fetchB() rejects

await Promise.all(requests);
// throws immediately with fetchB's error — fetchA/fetchC results are lost

await Promise.allSettled(requests);
// [{status:'fulfilled', value:...}, {status:'rejected', reason:...}, {status:'fulfilled', value:...}]
// never throws — you inspect .status on each entry yourself

await Promise.race(requests);
// settles with whichever of A/B/C finishes first, success or failure

await Promise.any(requests);
// resolves with the first SUCCESSFUL result (fetchA or fetchC)
// only throws AggregateError if all three reject`,related:[`async/await`,`try/catch around await`]}];function D(e){return E.find(t=>t.id===e)}function O(e){if(e===void 0)return`undefined`;try{return JSON.stringify(e)}catch{return String(e)}}function te(e){switch(e.kind){case`int`:return`int ${e.name}`;case`bool`:return`bool ${e.name}`;case`string`:return`char* ${e.name}`;case`intArray`:return`int* ${e.name}, int ${e.sizeName}`;case`stringArray`:return`char** ${e.name}, int ${e.sizeName}`;case`intMatrix`:return`int ${e.name}[][${e.cols}], int ${e.sizeName}`}}function ne(e){switch(e.kind){case`int`:return`int`;case`bool`:return`bool`;case`string`:return`char*`;case`intArray`:return`int*`;case`stringArray`:return`char**`}}function re(e,t){let n=t.params.map(te).join(`, `),r=t.returns.kind===`intArray`||t.returns.kind===`stringArray`,i=r?`${n}, int* returnSize`:n,a=r?`  // malloc your result array (the harness does not free it) and set *returnSize
`:``;return`${ne(t.returns)} ${e}(${i}) {\n${a}  // your code here\n}`}var k=`dsa_study_buddy_progress_v1`;function A(){try{let e=localStorage.getItem(k),t=e?JSON.parse(e):[];return new Set(t)}catch{return new Set}}function j(e){try{localStorage.setItem(k,JSON.stringify([...e]))}catch{}}function M(e){return A().has(e)}function N(e){let t=A();t.add(e),j(t)}function P(e){let t=A();return e.filter(e=>t.has(e)).length}var F=`dsa_study_buddy_solutions_v1`;function I(){try{let e=localStorage.getItem(F);return e?JSON.parse(e):{}}catch{return{}}}function L(e){try{localStorage.setItem(F,JSON.stringify(e))}catch{}}function R(e,t){let n=I();n[e]=t,L(n)}function z(e){return I()[e]??null}function B(){return Object.keys(I())}function V(){let e=B(),t=[],n=new Map;for(let r of e){let e=_(r),i=z(r);if(!e||!i)continue;let{pattern:a,problem:o}=e,s=`${a.id}/${o.id}.js`;t.push({path:s,content:`// ${o.title} (${o.difficulty})\n// Pattern: ${a.name}\n// Solved via DSA Study Buddy: https://github.com/rled7/dsa-study-buddy\n\n${i}\n`}),n.has(a.id)||n.set(a.id,{patternName:a.name,entries:[]}),n.get(a.id).entries.push({title:o.title,difficulty:o.difficulty,path:s})}let r=[`# My DSA Solutions`,``,`${t.length} problem${t.length===1?``:`s`} solved, organized by pattern.`,``,`_Exported from [DSA Study Buddy](https://github.com/rled7/dsa-study-buddy)._`,``];for(let e of g){let t=n.get(e.id);if(t&&t.entries.length!==0){r.push(`## ${t.patternName}`,``);for(let e of t.entries)r.push(`- [${e.title}](./${e.path}) — ${e.difficulty}`);r.push(``)}}return{files:[...t,{path:`README.md`,content:r.join(`
`)}],solvedCount:t.length}}n.install();function H(){let e=location.hash.replace(/^#\/?/,``).split(`/`).filter(Boolean);return e[0]===`concepts`&&e[1]?{view:`deepDive`,id:e[1]}:e[0]===`concepts`?{view:`concepts`}:e[0]===`reference`&&e[1]===`deepdive`&&e[2]?{view:`refDeepDive`,id:e[2]}:e[0]===`reference`&&e[1]?{view:`referenceLang`,langId:e[1]}:e[0]===`reference`?{view:`reference`}:e[0]===`brain`?{view:`brain`}:e[0]===`export`?{view:`export`}:e[0]===`pattern`&&e[1]&&e[2]===`sub`&&e[3]?{view:`subpattern`,patternId:e[1],subId:e[3]}:e[0]===`pattern`&&e[1]?{view:`pattern`,patternId:e[1]}:e[0]===`problem`&&e[1]?{view:`problem`,problemId:e[1]}:{view:`list`}}var U=null,W=null,G=null,K=null,q=`js`,J=[];function Y(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function X(e){return e.subpatterns.flatMap(e=>e.problems.map(e=>e.id))}function Z(e){return X(e).length}var ie=document.querySelector(`#app`);function Q(){let e=H();ie.innerHTML=`
    <div class="layout">
      <nav class="sidebar" id="sidebar">${ae(e)}</nav>
      <main class="content" id="content">${oe(e)}</main>
      <aside class="buddy-panel">${Se()}</aside>
    </div>
    <footer class="app-footer">
      <a href="/projects/dsa">← Portfolio project</a><span>Practice in your browser · Progress saved on this device</span>
    </footer>
  `,Ce(e)}function ae(e){let t=`patternId`in e?e.patternId:void 0;return`
    <a class="brand" href="#/">
      <span class="brand-mark">&lt;/&gt;</span>
      <span>DSA Study Buddy</span>
    </a>
    <div class="sidebar-list">${g.map((e,n)=>{let r=Z(e),i=r>0?P(X(e)):0,a=r>0?`${i}/${r}`:`soon`;return`
      <a class="sidebar-item${e.id===t?` active`:``}" href="#/pattern/${e.id}">
        <span class="sidebar-index">${n+1}</span>
        <span class="sidebar-name">${Y(e.name)}</span>
        <span class="sidebar-progress${r===0?` sidebar-progress--stub`:``}">${a}</span>
      </a>
    `}).join(``)}</div>
    <div class="sidebar-section-label">Reference</div>
    <a class="sidebar-item${e.view===`concepts`?` active`:``}" href="#/concepts">
      <span class="sidebar-index">&#9733;</span>
      <span class="sidebar-name">System Design Concepts</span>
      <span class="sidebar-progress sidebar-progress--stub">${y}</span>
    </a>
    <a class="sidebar-item${e.view===`reference`||e.view===`referenceLang`||e.view===`refDeepDive`?` active`:``}" href="#/reference">
      <span class="sidebar-index">&#128218;</span>
      <span class="sidebar-name">Language &amp; Framework Reference</span>
      <span class="sidebar-progress sidebar-progress--stub">${T}</span>
    </a>
    <a class="sidebar-item${e.view===`brain`?` active`:``}" href="#/brain">
      <span class="sidebar-index">&#129504;</span>
      <span class="sidebar-name">Feed the Brain</span>
      <span class="sidebar-progress${J.length===0?` sidebar-progress--stub`:``}">${J.length}</span>
    </a>
    <a class="sidebar-item${e.view===`export`?` active`:``}" href="#/export">
      <span class="sidebar-index">&#8593;</span>
      <span class="sidebar-name">Download solutions</span>
    </a>
  `}function oe(e){return e.view===`list`?ge():e.view===`concepts`?le():e.view===`deepDive`?de(e.id):e.view===`reference`?pe():e.view===`referenceLang`?me(e.langId):e.view===`refDeepDive`?he(e.id):e.view===`brain`?se():e.view===`export`?ce():e.view===`pattern`?ve(e.patternId):e.view===`subpattern`?ye(e.patternId,e.subId):be(e.problemId)}function se(){return`<h1>Feed the Brain</h1><p class="lead">The full local application can turn your notes into a searchable study library using Ollama embeddings and IndexedDB. AI and note ingestion run in the local edition.</p><p>In this public demo, explore the coding exercises, reference solutions, and system design library.</p><a class="primary-btn" href="#/">Explore practice patterns</a>`}function ce(){let e=V();return`<h1>Download your solutions</h1><p class="lead">${e.solvedCount} solved problem${e.solvedCount===1?``:`s`} saved on this device. Download your code and the generated README as a JSON file.</p><button class="primary-btn" id="download-solutions" ${e.solvedCount?``:`disabled`}>Download solutions</button><p>The local edition also supports direct GitHub export.</p>`}function le(){let e=v.map(e=>{let t=e.concepts.map(e=>`
          <div class="concept-item">
            ${e.deepDiveId?`<a class="concept-term concept-term--linked" href="#/concepts/${e.deepDiveId}">${Y(e.term)} &rarr;</a>`:`<span class="concept-term">${Y(e.term)}</span>`}
            <span class="concept-def">${Y(e.definition)}</span>
          </div>
        `).join(``);return`
      <section class="concept-group">
        <h3 class="concept-group-title">${Y(e.name)}</h3>
        <div class="concept-item-list">${t}</div>
      </section>
    `}).join(``);return`
    <h1>System Design Concepts</h1>
    <p class="lead">
      Architecture-level concepts to know before building any scalable application. Coding interviews test the
      16 patterns; system-design interviews test these. A quick-reference glossary &mdash; ${y}
      terms across ${v.length} areas. You don't need them all today &mdash; keep learning, keep building.
      Terms with a &rarr; link to a deeper breakdown with named strategies, code, and diagrams.
    </p>
    <div class="concept-groups">${e}</div>
  `}function ue(e){let t=(e,t)=>`
    <div class="strategy-diagram-wrap">
      <svg class="strategy-diagram" viewBox="0 0 300 128" xmlns="http://www.w3.org/2000/svg">${e}</svg>
      <p class="strategy-diagram-caption">${Y(t)}</p>
    </div>
  `;switch(e){case`Fixed Window Counter`:return t(`
          <rect x="6" y="20" width="88" height="80" class="sd-box"></rect>
          <rect x="106" y="20" width="88" height="80" class="sd-box"></rect>
          <rect x="206" y="20" width="88" height="80" class="sd-box"></rect>
          <text x="50" y="114" text-anchor="middle" class="sd-label">0&ndash;60s</text>
          <text x="150" y="114" text-anchor="middle" class="sd-label">60&ndash;120s</text>
          <text x="250" y="114" text-anchor="middle" class="sd-label">120&ndash;180s</text>
          <polyline points="14,94 94,28 106,94 194,28 206,94 286,28" class="sd-line"></polyline>
          <circle cx="94" cy="28" r="4" class="sd-warn-dot"></circle>
          <circle cx="106" cy="94" r="4" class="sd-warn-dot"></circle>
          <text x="150" y="10" text-anchor="middle" class="sd-warn-label">boundary burst: up to 2&times; limit</text>
        `,`The counter resets hard at each window edge — a burst right before and right after the boundary can slip through at close to 2× the limit.`);case`Sliding Window Log`:return t(`
          <rect x="14" y="50" width="272" height="20" class="sd-window"></rect>
          <line x1="14" y1="60" x2="286" y2="60" class="sd-timeline"></line>
          <circle cx="40" cy="60" r="4" class="sd-dot"></circle>
          <circle cx="115" cy="60" r="4" class="sd-dot"></circle>
          <circle cx="200" cy="60" r="4" class="sd-dot"></circle>
          <circle cx="255" cy="60" r="4" class="sd-dot"></circle>
          <text x="14" y="40" class="sd-label">t&minus;60s</text>
          <text x="286" y="40" text-anchor="end" class="sd-label">now</text>
          <text x="150" y="90" text-anchor="middle" class="sd-note">each dot = one request timestamp, kept until it ages out</text>
          <text x="150" y="108" text-anchor="middle" class="sd-note">log.length &lt; limit &rarr; allow</text>
        `,`Every request is timestamped and logged; drop anything older than the window, then compare the log's length to the limit. Exact, but memory grows with request volume.`);case`Sliding Window Counter`:return t(`
          <rect x="10" y="24" width="130" height="60" class="sd-box-dim"></rect>
          <rect x="150" y="24" width="130" height="60" class="sd-box"></rect>
          <rect x="100" y="24" width="50" height="60" class="sd-overlap"></rect>
          <text x="75" y="18" text-anchor="middle" class="sd-label">prev window</text>
          <text x="215" y="18" text-anchor="middle" class="sd-label">current window</text>
          <text x="125" y="102" text-anchor="middle" class="sd-note">overlap weighted into the count</text>
          <text x="150" y="118" text-anchor="middle" class="sd-note">weighted = prevCount&times;overlap + currCount</text>
        `,`Only two fixed counters are kept — the previous window's count is weighted by how much it still overlaps the sliding window, approximating the log without storing every timestamp.`);case`Token Bucket`:return t(`
          <text x="150" y="10" text-anchor="middle" class="sd-note">refill: 10 tokens/sec</text>
          <line x1="150" y1="14" x2="150" y2="20" class="sd-arrow-line"></line>
          <polygon points="146,14 154,14 150,20" class="sd-arrowhead"></polygon>
          <path d="M110,24 L190,24 L178,92 L122,92 Z" class="sd-bucket"></path>
          <circle cx="136" cy="46" r="5" class="sd-token"></circle>
          <circle cx="157" cy="43" r="5" class="sd-token"></circle>
          <circle cx="146" cy="62" r="5" class="sd-token"></circle>
          <circle cx="165" cy="60" r="5" class="sd-token"></circle>
          <circle cx="132" cy="76" r="5" class="sd-token-empty"></circle>
          <circle cx="160" cy="78" r="5" class="sd-token-empty"></circle>
          <line x1="150" y1="94" x2="150" y2="108" class="sd-arrow-line"></line>
          <polygon points="146,102 154,102 150,108" class="sd-arrowhead"></polygon>
          <text x="150" y="122" text-anchor="middle" class="sd-note">&minus;1 token / request, reject if empty</text>
        `,`Tokens refill at a steady rate; a request is allowed only if the bucket still has a token. Bursts up to the bucket's size pass through, while the long-run rate stays capped.`);case`Leaky Bucket`:return t(`
          <text x="150" y="10" text-anchor="middle" class="sd-note">requests queue in</text>
          <line x1="130" y1="14" x2="130" y2="20" class="sd-arrow-line"></line>
          <polygon points="126,14 134,14 130,20" class="sd-arrowhead"></polygon>
          <line x1="170" y1="14" x2="170" y2="20" class="sd-arrow-line"></line>
          <polygon points="166,14 174,14 170,20" class="sd-arrowhead"></polygon>
          <path d="M110,24 L190,24 L178,92 L122,92 Z" class="sd-bucket"></path>
          <circle cx="216" cy="30" r="4" class="sd-warn-dot"></circle>
          <text x="228" y="34" class="sd-note-warn">full &rarr; reject</text>
          <line x1="150" y1="94" x2="150" y2="108" class="sd-arrow-line"></line>
          <polygon points="146,102 154,102 150,108" class="sd-arrowhead"></polygon>
          <text x="150" y="122" text-anchor="middle" class="sd-note">leaks out at one fixed rate</text>
        `,`Requests queue into a fixed-size bucket that drains at a constant rate. New requests are dropped once the bucket is full — this smooths bursts into one steady output rate instead of letting them through.`);default:return``}}function de(e){let t=x(e);if(!t)return $(`Deep dive not found.`);let n=t.strategies.map(e=>{let t=ue(e.name);return`
        <section class="deepdive-strategy">
          <h3 class="deepdive-strategy-name">${Y(e.name)}</h3>
          <p class="deepdive-strategy-desc">${Y(e.description)}</p>
          <div class="deepdive-panels">
            <div class="deepdive-panel">
              <span class="deepdive-panel-label">Flow</span>
              ${t||`<pre class="deepdive-diagram">${Y(e.diagram)}</pre>`}
            </div>
            <div class="deepdive-panel">
              <span class="deepdive-panel-label">Code</span>
              <pre class="deepdive-code"><code>${Y(e.code)}</code></pre>
            </div>
          </div>
        </section>
      `}).join(``),r=t.practiceSubId?`
      <a class="deepdive-practice-cta" href="#/pattern/system-design/sub/${t.practiceSubId}">
        Practice this &rarr; solve the graded problems for ${Y(t.title)}
      </a>
    `:``;return`
    <p class="breadcrumb"><a href="#/concepts">System Design Concepts</a></p>
    <h1>${Y(t.title)}</h1>
    <p class="lead">${Y(t.intro)}</p>
    ${r}
    <div class="deepdive-strategy-list">${n}</div>
  `}var fe={beginner:`Beginner`,intermediate:`Intermediate`,advanced:`Advanced`};function pe(){return`
    <h1>Language &amp; Framework Reference</h1>
    <p class="lead">
      Curated core methods and concepts, leveled beginner &rarr; advanced, per language and framework.
      This is a hand-picked reference, not an exhaustive dump &mdash; for anything not listed here, ask
      the buddy panel on the right; the local model can answer arbitrary method questions on demand.
    </p>
    <div class="pattern-grid">
      ${S.map(e=>{let t=w(e.id);return`
          <a class="pattern-card${t===0?` pattern-card--stub`:``}" href="#/reference/${e.id}">
            <h3>${Y(e.name)}</h3>
            <p>${Y(e.tagline)}</p>
            <span class="badge">${t>0?`${t} entries`:`coming soon`}</span>
          </a>
        `}).join(``)}
    </div>
  `}function me(e){let t=S.find(t=>t.id===e);if(!t)return $(`Language reference not found.`);if(t.categories.length===0)return`
      <p class="breadcrumb"><a href="#/reference">Language &amp; Framework Reference</a></p>
      <h1>${Y(t.name)}</h1>
      <p class="lead">${Y(t.tagline)}</p>
      <p class="coming-soon">
        Curated reference for ${Y(t.name)} is coming soon. In the meantime, ask the buddy
        panel on the right &mdash; it can answer method/syntax questions for ${Y(t.name)} directly.
      </p>
    `;let n=t.categories.map(e=>{let t=e.items.map(e=>`
            <div class="ref-item">
              <div class="ref-item-head">
                ${e.deepDiveId?`<a class="ref-item-name ref-item-name--linked" href="#/reference/deepdive/${e.deepDiveId}">${Y(e.name)} &rarr;</a>`:`<span class="ref-item-name">${Y(e.name)}</span>`}
                <span class="ref-level-badge ref-level-badge--${e.level}">${fe[e.level]}</span>
              </div>
              <p class="ref-item-summary">${Y(e.summary)}</p>
              ${e.example?`<code class="ref-item-example">${Y(e.example)}</code>`:``}
            </div>
          `).join(``);return`
        <section class="concept-group">
          <h3 class="concept-group-title">${Y(e.name)}</h3>
          <div class="ref-item-list">${t}</div>
        </section>
      `}).join(``);return`
    <p class="breadcrumb"><a href="#/reference">Language &amp; Framework Reference</a></p>
    <h1>${Y(t.name)}</h1>
    <p class="lead">
      ${Y(t.tagline)} &mdash; ${w(t.id)} curated entries across
      ${t.categories.length} categories, ordered beginner &rarr; advanced within each. Anything not
      listed here? Ask the buddy panel.
    </p>
    <div class="concept-groups">${n}</div>
  `}function he(e){let t=D(e);if(!t)return $(`Reference deep dive not found.`);let n=S.find(e=>e.id===t.langId),r=t.gotchas.map(e=>`<li>${Y(e)}</li>`).join(``),i=t.related?.length?`
      <p class="refdive-related">
        <span class="deepdive-panel-label">Related</span>
        ${t.related.map(e=>`<code class="ref-item-example">${Y(e)}</code>`).join(` &middot; `)}
      </p>
    `:``;return`
    <p class="breadcrumb"><a href="#/reference/${t.langId}">${Y(n?.name??t.langId)}</a></p>
    <h1>${Y(t.title)}</h1>
    <p class="lead">${Y(t.intro)}</p>
    <div class="deepdive-panels">
      <div class="deepdive-panel refdive-gotchas-panel">
        <span class="deepdive-panel-label">Gotchas</span>
        <ul class="refdive-gotchas">${r}</ul>
      </div>
      <div class="deepdive-panel">
        <span class="deepdive-panel-label">Code</span>
        <pre class="deepdive-code"><code>${Y(t.code)}</code></pre>
      </div>
    </div>
    ${i}
  `}function ge(){let e=g.reduce((e,t)=>e+Z(t),0);return`
    <h1>The 16 DSA Patterns</h1>
    <p class="lead">
      Every technical interview question is a remix of a small set of patterns. Pick a pattern to see its
      sub-patterns, then pick a sub-pattern to see a plain-English explanation and practice problems.
    </p>
    <p class="overall-progress">Overall progress: <strong>${P(g.flatMap(X))}/${e}</strong> seeded problems solved.</p>
    <div class="pattern-grid">
      ${g.map(e=>{let t=Z(e),n=t>0?P(X(e)):0;return`
          <a class="pattern-card${t===0?` pattern-card--stub`:``}" href="#/pattern/${e.id}">
            <h3>${Y(e.name)}</h3>
            <p>${e.subpatterns.length} sub-patterns</p>
            <span class="badge">${t>0?`${n}/${t} solved`:`structure only`}</span>
          </a>
        `}).join(``)}
    </div>
  `}function _e(){let e=(e,t,n,r,i,a,o)=>{let s=e+n/2,c=`
      <rect x="${e}" y="${t}" width="${n}" height="${r}" rx="6"></rect>
      <text x="${s}" y="${t+r/2-4}" text-anchor="middle">${Y(i)}</text>
      <text class="sysdes-diagram-sub" x="${s}" y="${t+r/2+12}" text-anchor="middle">${Y(a)}</text>
    `;return o?`<a href="#/pattern/system-design/sub/${o}" class="sysdes-diagram-box">${c}</a>`:`<g class="sysdes-diagram-box">${c}</g>`},t=e=>`<path class="sysdes-diagram-edge" d="${e}" marker-end="url(#sysdes-arrow)"></path>`;return`
    <div class="sysdes-diagram-wrap">
      <p class="sysdes-diagram-caption">
        Where these building blocks sit in a typical request path — click any box to jump to that sub-pattern.
      </p>
      <svg class="sysdes-diagram" viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="sysdes-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path class="sysdes-diagram-arrowhead" d="M0,0 L10,5 L0,10 z"></path>
          </marker>
        </defs>
        ${t(`M112,150 L148,150`)}
        ${t(`M280,150 L316,150`)}
        ${t(`M428,150 L464,46`)}
        ${t(`M428,150 L464,150`)}
        ${t(`M428,150 L464,254`)}
        ${t(`M614,46 L650,150`)}
        ${t(`M614,150 L650,150`)}
        ${t(`M614,254 L650,150`)}
        ${e(8,122,104,56,`Client`,`issues a request`)}
        ${e(148,122,132,56,`Traffic Control`,`rate limit / idempotency`,`sysdes-traffic-control`)}
        ${e(316,122,112,56,`Caching`,`LRU / LFU eviction`,`sysdes-caching`)}
        ${e(464,18,150,56,`Search & Indexing`,`trie / inverted index`,`sysdes-search`)}
        ${e(464,122,150,56,`Coordination`,`leader election`,`sysdes-distributed-coordination`)}
        ${e(464,226,150,56,`Probabilistic`,`bloom / count-min`,`sysdes-probabilistic`)}
        ${e(650,122,140,56,`Observability`,`metrics & dashboards`,`sysdes-observability`)}
      </svg>
    </div>
  `}function ve(e){let t=g.find(t=>t.id===e);return t?`
    <p class="breadcrumb"><a href="#/">All patterns</a></p>
    <h1>${Y(t.name)}</h1>
    <p class="lead">Sub-patterns within ${Y(t.name)}:</p>
    ${t.id===`system-design`?_e():``}
    <div class="subpattern-list">
      ${t.subpatterns.map(e=>{let n=P(e.problems.map(e=>e.id));return`
            <a class="subpattern-card" href="#/pattern/${t.id}/sub/${e.id}">
              <h3>${Y(e.name)}</h3>
              <p>${Y(e.explanation)}</p>
              <span class="badge">${e.problems.length>0?`${n}/${e.problems.length} solved`:`problems coming soon`}</span>
            </a>
          `}).join(``)}
    </div>
  `:$(`Pattern not found.`)}function ye(e,t){let n=g.find(t=>t.id===e),r=n?.subpatterns.find(e=>e.id===t);return!n||!r?$(`Sub-pattern not found.`):`
    <p class="breadcrumb"><a href="#/">All patterns</a> &rsaquo; <a href="#/pattern/${n.id}">${Y(n.name)}</a></p>
    <h1>${Y(r.name)}</h1>
    <p class="lead">${Y(r.explanation)}</p>
    ${r.problems.length===0?`<p class="coming-soon">Problems coming soon for this sub-pattern.</p>`:`<div class="problem-list">
            ${r.problems.map(e=>{let t=M(e.id);return`
                  <a class="problem-card" href="#/problem/${e.id}">
                    <h3>${Y(e.title)} ${t?`<span class="solved-check">&check; Solved</span>`:``}</h3>
                    <span class="badge badge--${e.difficulty.toLowerCase()}">${e.difficulty}</span>
                  </a>
                `}).join(``)}
          </div>`}
  `}function be(e){let t=_(e);if(!t)return $(`Problem not found.`);let{pattern:n,subpattern:r,problem:i}=t;K!==i.id&&(K=i.id,U=null,W=null,q=`js`);let a=q===`c`&&i.cSignature?re(i.fnName,i.cSignature):i.starterCode,o=W??a,s=M(i.id),c=q===`c`;return`
    <p class="breadcrumb">
      <a href="#/">All patterns</a> &rsaquo;
      <a href="#/pattern/${n.id}">${Y(n.name)}</a> &rsaquo;
      <a href="#/pattern/${n.id}/sub/${r.id}">${Y(r.name)}</a>
    </p>
    <h1>${Y(i.title)} ${s?`<span class="solved-check">&check; Solved</span>`:``}</h1>
    <span class="badge badge--${i.difficulty.toLowerCase()}">${i.difficulty}</span>
    <div class="description">${Y(i.description).split(`

`).map(e=>`<p>${e}</p>`).join(``)}</div>

    <h2>Your solution</h2>
    ${i.cSignature,``}
    <textarea id="code-editor" class="code-editor" spellcheck="false">${Y(o)}</textarea>
    <div class="editor-actions">
      <button type="button" id="run-tests-btn" class="primary-btn" >Run tests</button>
      <button type="button" id="show-solution-btn" class="secondary-btn"${c?` disabled title="Reference solutions are shown in JavaScript only."`:``}>Show solution</button>
    </div>

    <div id="solution-reveal" class="solution-reveal" hidden>
      ${i.solutions&&i.solutions.length>0?`<h3>Reference solutions (fastest &rarr; slowest)</h3>
             <div class="solutions-list">
               ${i.solutions.map((e,t)=>`
                 <div class="solution-approach">
                   <h4>${t+1}. ${Y(e.approach)}</h4>
                   <p class="solution-complexity"><strong>Time:</strong> ${Y(e.timeComplexity)} &middot; <strong>Space:</strong> ${Y(e.spaceComplexity)}</p>
                   <p class="solution-explanation">${Y(e.explanation)}</p>
                   <pre class="solution-code-block">${Y(e.code)}</pre>
                 </div>`).join(``)}
             </div>`:`<h3>Reference solution</h3>
             <pre id="solution-code"></pre>`}
    </div>

    <div id="test-results">${U?xe(U):``}</div>
  `}function xe(e){return e.compileError?`
      <div class="run-summary run-summary--fail">Could not run your code: ${Y(e.compileError)}</div>
    `:`${e.allPassed?`<div class="run-summary run-summary--pass">All ${e.results.length} test cases passed.</div>`:`<div class="run-summary run-summary--fail">${e.results.filter(e=>e.pass).length}/${e.results.length} test cases passed.</div>`}<div class="test-case-list">${e.results.map(e=>`
        <div class="test-case test-case--${e.pass?`pass`:`fail`}">
          <span class="test-case-label">${e.pass?`PASS`:`FAIL`} #${e.index+1}</span>
          <span class="test-case-field"><strong>input:</strong> ${Y(O(e.input))}</span>
          <span class="test-case-field"><strong>expected:</strong> ${Y(O(e.expected))}</span>
          <span class="test-case-field"><strong>got:</strong> ${e.error?`threw: ${Y(e.error)}`:Y(O(e.got))}</span>
        </div>
      `).join(``)}</div>`}function $(e){return`<p class="breadcrumb"><a href="#/">All patterns</a></p><h1>Not found</h1><p>${Y(e)}</p>`}function Se(){return`<h2>Your study workspace</h2><p>Pick a pattern, write a JavaScript solution, and run the test cases. Use “Show solution” to compare approaches and complexity.</p><h3>AI in the local edition</h3><p>The full application includes an Ollama study assistant and a retrieval library for your notes. This public demo focuses on browser coding practice.</p><a href="#/concepts">Explore system design →</a>`}function Ce(e){if(e.view===`brain`)return;if(e.view===`export`){we();return}if(e.view!==`problem`)return;let t=_(e.problemId);if(!t)return;let{problem:n}=t,r=document.querySelector(`#code-editor`),i=document.querySelector(`#run-tests-btn`),a=document.querySelector(`#show-solution-btn`),s=document.querySelector(`#solution-reveal`),c=document.querySelector(`#solution-code`),l=document.querySelector(`#language-select`);l?.addEventListener(`change`,()=>{q=l.value===`c`?`c`:`js`,W=null,U=null,Q()}),i.addEventListener(`click`,async()=>{W=r.value;{G?.abort();let e=new AbortController;G=e;let t=r.value;i.disabled=!0,i.textContent=`Running…`;try{let r=await o(t,n.id,e.signal);if(e.signal.aborted)return;U=r,r.allPassed&&(N(n.id),R(n.id,t))}catch{U={allPassed:!1,results:[],compileError:`Could not start the test runner. Please try again.`}}finally{G===e&&(G=null,e.signal.aborted||Q())}return}}),a.addEventListener(`click`,()=>{c&&(c.textContent=n.solution),s.hidden=!s.hidden})}function we(){document.querySelector(`#download-solutions`)?.addEventListener(`click`,()=>{let e=URL.createObjectURL(new Blob([JSON.stringify(V(),null,2)],{type:`application/json`})),t=document.createElement(`a`);t.href=e,t.download=`dsa-study-buddy-solutions.json`,t.click(),setTimeout(()=>URL.revokeObjectURL(e),1e3)})}window.addEventListener(`hashchange`,()=>{G?.abort(),G=null,Q()}),Q();