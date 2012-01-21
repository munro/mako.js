var OP_CONST  = 0;
var OP_CALL   = 1;
var OP_JUMP   = 2;
var OP_JUMPZ  = 3;
var OP_JUMPIF = 4;

var OP_LOAD   = 10;
var OP_STOR   = 11;
var OP_RETURN = 12;
var OP_DROP   = 13;
var OP_SWAP   = 14;
var OP_DUP    = 15;
var OP_OVER   = 16;
var OP_STR    = 17;
var OP_RTS    = 18;

var OP_ADD    = 19;
var OP_SUB    = 20;
var OP_MUL    = 21;
var OP_DIV    = 22;
var OP_MOD    = 23;
var OP_AND    = 24;
var OP_OR     = 25;
var OP_XOR    = 26;
var OP_NOT    = 27;
var OP_SGT    = 28;
var OP_SLT    = 29;
var OP_SYNC   = 30;
var OP_NEXT   = 31;

var PC =  0; // program counter
var DP =  1; // data stack pointer
var RP =  2; // return stack pointer

var GP =  3; // grid pointer
var GT =  4; // grid tile pointer
var SP =  5; // sprite pointer
var ST =  6; // sprite tile pointer
var SX =  7; // scroll X
var SY =  8; // scroll Y
var GS =  9; // grid horizontal skip
var CL = 10; // clear color
var RN = 11; // random number
var KY = 12; // key input

var CO = 13; // character-out (debug)
var AU = 14; // audio-out (8khz, 8-bit)

var RESERVED_HEADER = 15;

var H_MIRROR_MASK = 0x10000; // sprite is mirrored horizontally?
var V_MIRROR_MASK = 0x20000; // sprite is mirrored vertically?
var GRID_Z_MASK = 0x40000000; // grid tile is drawn above sprites?

var KEY_UP = 0x01;
var KEY_RT = 0x02;
var KEY_DN = 0x04;
var KEY_LF = 0x08;
var KEY_A  = 0x10;
var KEY_B  = 0x20;
var KEY_MASK = KEY_UP | KEY_RT | KEY_DN | KEY_LF | KEY_A | KEY_B;
