// === js/levels.js ===
const LEVELS = [
  // 1
  { cols:4,rows:4,optimal:7,buses:[
    {id:1,x:1,y:1,dir:'R',len:2,color:'red',cap:2},
    {id:2,x:0,y:2,dir:'R',len:2,color:'blue',cap:2}
  ],catQueue:['red','red','blue','blue']},
  // 2
  { cols:4,rows:4,optimal:8,buses:[
    {id:1,x:2,y:0,dir:'D',len:2,color:'green',cap:2},
    {id:2,x:0,y:2,dir:'R',len:3,color:'yellow',cap:3}
  ],catQueue:['yellow','yellow','yellow','green','green']},
  // 3
  { cols:5,rows:5,optimal:9,buses:[
    {id:1,x:2,y:1,dir:'D',len:2,color:'red',cap:2},
    {id:2,x:0,y:2,dir:'R',len:2,color:'blue',cap:2}
  ],catQueue:['blue','blue','red','red']},
  // 4
  { cols:5,rows:5,optimal:13,buses:[
    {id:1,x:1,y:2,dir:'R',len:2,color:'yellow',cap:2},
    {id:2,x:3,y:1,dir:'D',len:2,color:'green',cap:2},
    {id:3,x:0,y:3,dir:'R',len:2,color:'blue',cap:2}
  ],catQueue:['yellow','yellow','blue','blue','green','green']},
  // 5
  { cols:5,rows:5,optimal:13,buses:[
    {id:1,x:2,y:1,dir:'D',len:2,color:'purple',cap:2},
    {id:2,x:0,y:2,dir:'R',len:2,color:'orange',cap:2},
    {id:3,x:1,y:3,dir:'R',len:3,color:'purple',cap:3}
  ],catQueue:['orange','orange','purple','purple','purple','purple','purple']},
  // 6 — FIXED: Bus2 moved to col 4
  { cols:5,rows:5,optimal:12,buses:[
    {id:1,x:2,y:2,dir:'R',len:2,color:'red',cap:2},
    {id:2,x:4,y:0,dir:'D',len:3,color:'blue',cap:3},
    {id:3,x:0,y:1,dir:'D',len:2,color:'red',cap:2}
  ],catQueue:['red','red','red','red','blue','blue','blue']},
  // 7 — FIXED: Bus2 moved to col 4
  { cols:5,rows:5,optimal:17,buses:[
    {id:1,x:1,y:2,dir:'R',len:3,color:'green',cap:3},
    {id:2,x:4,y:1,dir:'D',len:2,color:'yellow',cap:2},
    {id:3,x:0,y:0,dir:'D',len:2,color:'blue',cap:2},
    {id:4,x:1,y:4,dir:'R',len:2,color:'blue',cap:2}
  ],catQueue:['yellow','yellow','green','green','green','blue','blue','blue','blue']},
  // 8 — FIXED: overlap removed
  { cols:5,rows:5,optimal:19,buses:[
    {id:1,x:2,y:1,dir:'D',len:2,color:'purple',cap:2},
    {id:2,x:0,y:2,dir:'R',len:2,color:'orange',cap:2},
    {id:3,x:0,y:4,dir:'R',len:3,color:'purple',cap:3},
    {id:4,x:4,y:3,dir:'U',len:2,color:'red',cap:2}
  ],catQueue:['orange','orange','purple','purple','purple','purple','purple','red','red']},
  // 9
  { cols:5,rows:5,optimal:16,buses:[
    {id:1,x:0,y:1,dir:'R',len:2,color:'yellow',cap:2},
    {id:2,x:2,y:0,dir:'D',len:3,color:'green',cap:3},
    {id:3,x:3,y:2,dir:'R',len:2,color:'blue',cap:2},
    {id:4,x:1,y:3,dir:'R',len:2,color:'yellow',cap:2}
  ],catQueue:['blue','blue','yellow','yellow','yellow','yellow','green','green','green']},
  // 10
  { cols:5,rows:5,optimal:18,buses:[
    {id:1,x:1,y:2,dir:'R',len:2,color:'red',cap:2},
    {id:2,x:3,y:1,dir:'D',len:3,color:'orange',cap:3},
    {id:3,x:0,y:0,dir:'D',len:2,color:'red',cap:2},
    {id:4,x:0,y:3,dir:'R',len:2,color:'blue',cap:2}
  ],catQueue:['blue','blue','red','red','red','red','orange','orange','orange']},
  // 11
  { cols:6,rows:6,optimal:19,buses:[
    {id:1,x:1,y:2,dir:'R',len:3,color:'red',cap:3},
    {id:2,x:4,y:2,dir:'D',len:2,color:'blue',cap:2},
    {id:3,x:2,y:3,dir:'L',len:2,color:'purple',cap:2},
    {id:4,x:3,y:4,dir:'U',len:2,color:'blue',cap:1}
  ],catQueue:['purple','purple','red','red','red','blue','blue','blue']},
  // 12
  { cols:6,rows:6,optimal:25,buses:[
    {id:1,x:2,y:1,dir:'D',len:3,color:'green',cap:3},
    {id:2,x:3,y:2,dir:'R',len:2,color:'yellow',cap:2},
    {id:3,x:0,y:3,dir:'R',len:2,color:'green',cap:2},
    {id:4,x:1,y:4,dir:'R',len:3,color:'blue',cap:3},
    {id:5,x:4,y:0,dir:'D',len:2,color:'yellow',cap:2}
  ],catQueue:['yellow','yellow','yellow','yellow','green','green','green','green','green','blue','blue','blue']},
  // 13
  { cols:6,rows:6,optimal:24,buses:[
    {id:1,x:0,y:0,dir:'D',len:3,color:'orange',cap:3},
    {id:2,x:1,y:2,dir:'R',len:2,color:'green',cap:2},
    {id:3,x:4,y:1,dir:'D',len:2,color:'orange',cap:1},
    {id:4,x:3,y:4,dir:'R',len:2,color:'red',cap:2},
    {id:5,x:1,y:5,dir:'R',len:2,color:'green',cap:2}
  ],catQueue:['green','green','green','green','orange','orange','orange','orange','red','red']},
  // 14 — FIXED: Bus2 moved to col 4
  { cols:6,rows:6,optimal:26,buses:[
    {id:1,x:2,y:2,dir:'R',len:2,color:'purple',cap:2},
    {id:2,x:4,y:0,dir:'D',len:3,color:'blue',cap:3},
    {id:3,x:0,y:1,dir:'D',len:2,color:'purple',cap:2},
    {id:4,x:1,y:3,dir:'R',len:2,color:'yellow',cap:2},
    {id:5,x:3,y:4,dir:'U',len:2,color:'blue',cap:2}
  ],catQueue:['yellow','yellow','purple','purple','purple','purple','blue','blue','blue','blue','blue']},
  // 15
  { cols:6,rows:6,optimal:33,buses:[
    {id:1,x:0,y:1,dir:'R',len:2,color:'yellow',cap:2},
    {id:2,x:3,y:0,dir:'D',len:3,color:'blue',cap:3},
    {id:3,x:4,y:3,dir:'D',len:2,color:'yellow',cap:2},
    {id:4,x:0,y:3,dir:'R',len:2,color:'red',cap:3},
    {id:5,x:1,y:4,dir:'U',len:2,color:'blue',cap:1},
    {id:6,x:4,y:5,dir:'L',len:2,color:'red',cap:1}
  ],catQueue:['red','red','red','red','yellow','yellow','yellow','yellow','blue','blue','blue','blue']},
  // 16 — FIXED: Bus6 repositioned
  { cols:6,rows:6,optimal:32,buses:[
    {id:1,x:0,y:1,dir:'R',len:2,color:'red',cap:2},
    {id:2,x:2,y:0,dir:'D',len:3,color:'yellow',cap:3},
    {id:3,x:3,y:2,dir:'R',len:2,color:'blue',cap:2},
    {id:4,x:5,y:1,dir:'D',len:2,color:'blue',cap:2},
    {id:5,x:3,y:4,dir:'U',len:2,color:'red',cap:2},
    {id:6,x:0,y:5,dir:'R',len:2,color:'yellow',cap:2}
  ],catQueue:['yellow','yellow','yellow','yellow','yellow','blue','blue','blue','blue','red','red','red','red']},
  // 17 — FIXED: Bus6 moved to x:0,y:5 (overlap removed)
  { cols:6,rows:6,optimal:24,buses:[
    {id:1,x:1,y:1,dir:'D',len:2,color:'green',cap:2},
    {id:2,x:2,y:2,dir:'R',len:2,color:'purple',cap:2},
    {id:3,x:4,y:1,dir:'D',len:3,color:'orange',cap:3},
    {id:4,x:0,y:3,dir:'R',len:3,color:'blue',cap:3},
    {id:5,x:3,y:4,dir:'U',len:2,color:'purple',cap:2},
    {id:6,x:0,y:5,dir:'R',len:2,color:'green',cap:2}
  ],catQueue:['purple','purple','purple','purple','orange','orange','orange',
              'blue','blue','blue','green','green','green','green']},
  // 18
  { cols:6,rows:6,optimal:29,buses:[
    {id:1,x:0,y:1,dir:'R',len:2,color:'red',cap:2},
    {id:2,x:2,y:0,dir:'D',len:3,color:'yellow',cap:3},
    {id:3,x:3,y:2,dir:'R',len:2,color:'blue',cap:2},
    {id:4,x:5,y:1,dir:'D',len:2,color:'blue',cap:2},
    {id:5,x:1,y:3,dir:'R',len:2,color:'yellow',cap:2},
    {id:6,x:3,y:4,dir:'U',len:2,color:'red',cap:2}
  ],catQueue:['yellow','yellow','yellow','yellow','yellow','blue','blue','blue','blue','red','red','red','red']},
  // 19
  { cols:6,rows:6,optimal:26,buses:[
    {id:1,x:0,y:1,dir:'R',len:2,color:'purple',cap:2},
    {id:2,x:2,y:1,dir:'D',len:2,color:'green',cap:2},
    {id:3,x:3,y:1,dir:'R',len:3,color:'blue',cap:3},
    {id:4,x:1,y:3,dir:'D',len:3,color:'purple',cap:2},
    {id:5,x:2,y:4,dir:'R',len:2,color:'green',cap:2},
    {id:6,x:5,y:3,dir:'U',len:2,color:'blue',cap:1}
  ],catQueue:['blue','blue','blue','blue','purple','purple','purple','purple','green','green','green','green']},
  // 20
  { cols:6,rows:6,optimal:36,buses:[
    {id:1,x:1,y:0,dir:'D',len:2,color:'orange',cap:2},
    {id:2,x:2,y:1,dir:'R',len:2,color:'yellow',cap:2},
    {id:3,x:4,y:0,dir:'D',len:3,color:'orange',cap:2},
    {id:4,x:0,y:2,dir:'R',len:3,color:'red',cap:3},
    {id:5,x:3,y:3,dir:'D',len:2,color:'yellow',cap:2},
    {id:6,x:1,y:5,dir:'R',len:2,color:'red',cap:1},
    {id:7,x:4,y:4,dir:'L',len:2,color:'yellow',cap:1}
  ],catQueue:['orange','orange','orange','orange','yellow','yellow','yellow','yellow','yellow','red','red','red','red']},
  // 21 — FIXED: catQueue reordered to match natural exit flow
  { cols:6,rows:6,optimal:22,buses:[
    {id:1,x:0,y:0,dir:'R',len:2,color:'blue',cap:2},
    {id:2,x:2,y:0,dir:'D',len:3,color:'red',cap:3},
    {id:3,x:3,y:1,dir:'R',len:2,color:'green',cap:2},
    {id:4,x:5,y:1,dir:'D',len:3,color:'blue',cap:2},
    {id:5,x:0,y:2,dir:'D',len:2,color:'purple',cap:2},
    {id:6,x:1,y:3,dir:'R',len:3,color:'green',cap:2},
    {id:7,x:2,y:4,dir:'D',len:2,color:'purple',cap:2}
  ],catQueue:['blue','blue','blue','blue','green','green','green','green',
              'red','red','red','purple','purple','purple','purple']},
  // 22 — FIXED: full redesign (same colors/counts, no deadlock)
  { cols:6,rows:6,optimal:30,buses:[
    {id:1,x:0,y:0,dir:'R',len:2,color:'orange',cap:2},
    {id:2,x:3,y:0,dir:'D',len:3,color:'red',cap:3},
    {id:3,x:4,y:0,dir:'D',len:2,color:'yellow',cap:2},
    {id:4,x:0,y:2,dir:'D',len:2,color:'blue',cap:3},
    {id:5,x:1,y:3,dir:'R',len:2,color:'orange',cap:2},
    {id:6,x:4,y:3,dir:'R',len:2,color:'yellow',cap:2},
    {id:7,x:0,y:5,dir:'R',len:3,color:'red',cap:2}
  ],catQueue:['orange','orange','orange','orange','red','red','red','red','red',
              'yellow','yellow','yellow','yellow','blue','blue','blue']},
  // 23
  { cols:6,rows:6,optimal:33,buses:[
    {id:1,x:1,y:2,dir:'D',len:2,color:'purple',cap:2},
    {id:2,x:2,y:1,dir:'R',len:3,color:'green',cap:3},
    {id:3,x:5,y:0,dir:'D',len:3,color:'orange',cap:3},
    {id:4,x:0,y:4,dir:'R',len:3,color:'purple',cap:3},
    {id:5,x:3,y:3,dir:'D',len:2,color:'orange',cap:2},
    {id:6,x:4,y:5,dir:'L',len:2,color:'green',cap:2}
  ],catQueue:['green','green','green','green','green','orange','orange','orange','orange','orange','purple','purple','purple','purple','purple']},
  // 24 — FIXED: deadlock resolved
  { cols:6,rows:6,optimal:32,buses:[
    {id:1,x:0,y:0,dir:'D',len:2,color:'green',cap:2},
    {id:2,x:1,y:1,dir:'R',len:3,color:'purple',cap:3},
    {id:3,x:4,y:0,dir:'D',len:2,color:'blue',cap:2},
    {id:4,x:5,y:2,dir:'D',len:3,color:'yellow',cap:3},
    {id:5,x:0,y:3,dir:'D',len:2,color:'green',cap:2},
    {id:6,x:2,y:4,dir:'R',len:2,color:'purple',cap:2},
    {id:7,x:2,y:2,dir:'R',len:2,color:'blue',cap:2}
  ],catQueue:['purple','purple','purple','purple','purple','blue','blue','blue','blue','yellow','yellow','yellow','green','green','green','green']},
  // 25 — FIXED: full redesign (same colors/counts, no deadlock)
  { cols:6,rows:6,optimal:32,buses:[
    {id:1,x:0,y:0,dir:'D',len:3,color:'blue',cap:3},
    {id:2,x:1,y:1,dir:'R',len:2,color:'purple',cap:2},
    {id:3,x:3,y:0,dir:'D',len:2,color:'red',cap:2},
    {id:4,x:4,y:2,dir:'D',len:2,color:'yellow',cap:2},
    {id:5,x:5,y:0,dir:'D',len:3,color:'blue',cap:2},
    {id:6,x:0,y:3,dir:'R',len:3,color:'orange',cap:3},
    {id:7,x:3,y:3,dir:'D',len:2,color:'purple',cap:2},
    {id:8,x:1,y:5,dir:'R',len:2,color:'red',cap:2}
  ],catQueue:['purple','purple','purple','purple','red','red','red','red',
              'orange','orange','orange','yellow','yellow',
              'blue','blue','blue','blue','blue']}
];
