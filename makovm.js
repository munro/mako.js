function MakoVM() {
    'use strict';

    this.m = rom;
    this.p = [];
    this.keys = 0;

    this.push = function (v)   { this.m[this.m[DP]++] = v; };
    this.rpush = function (v)  { this.m[this.m[RP]++] = v; };
    this.pop = function ()     { return this.m[--this.m[DP]]; };
    this.rpop = function ()    { return this.m[--this.m[RP]]; };
    this.mod = function (a, b) { a %= b; return a < 0 ? a+b : a; };

    this.tick = function () {
        var o = this.m[this.m[PC]++];
        var a, b;

        switch(o) {
            case OP_CONST:
                this.push(this.m[this.m[PC]++]);
                break;
            case OP_CALL:
                this.rpush(this.m[PC]+1);
                this.m[PC] = this.m[this.m[PC]];
                break;
            case OP_JUMP:
                this.m[PC] = this.m[this.m[PC]];
                break;
            case OP_JUMPZ:
                this.m[PC] = this.pop()===0 ? this.m[this.m[PC]] : this.m[PC]+1;
                break;
            case OP_JUMPIF:
                this.m[PC] = this.pop()!==0 ? this.m[this.m[PC]] : this.m[PC]+1;
                break;
            case OP_LOAD:
                this.push(this.load(this.pop()));
                break;
            case OP_STOR:
                this.stor(this.pop(),this.pop());
                break;
            case OP_RETURN:
                this.m[PC] = this.rpop();
                break;
            case OP_DROP:
                this.pop();
                break;
            case OP_SWAP:
                a = this.pop();
                b = this.pop();
                this.push(a);
                this.push(b);
                break;
            case OP_DUP:
                this.push(this.m[this.m[DP]-1]);
                break;
            case OP_OVER:
                this.push(this.m[this.m[DP]-2]);
                break;
            case OP_STR:
                this.rpush(this.pop());
                break;
            case OP_RTS:
                this.push(this.rpop());
                break;
            case OP_ADD:
                a = this.pop();
                b = this.pop();
                this.push(b+a);
                break;
            case OP_SUB:
                a = this.pop();
                b = this.pop();
                this.push(b-a);
                break;
            case OP_MUL:
                a = this.pop();
                b = this.pop();
                this.push(b*a);
                break;
            case OP_DIV:
                a = this.pop();
                b = this.pop();
                this.push(b/a);
                break;
            case OP_MOD:
                a = this.pop();
                b = this.pop();
                this.push(this.mod(b,a));
                break;
            case OP_AND:
                a = this.pop();
                b = this.pop();
                this.push(b&a);
                break;
            case OP_OR:
                a = this.pop();
                b = this.pop();
                this.push(b|a);
                break;
            case OP_XOR:
                a = this.pop();
                b = this.pop();
                this.push(b^a);
                break;
            case OP_NOT:
                this.push(~this.pop());
                break;
            case OP_SGT:
                a = this.pop();
                b = this.pop();
                this.push(b>a ? -1:0);
                break;
            case OP_SLT:
                a = this.pop();
                b = this.pop();
                this.push(b<a ? -1:0);
                break;
            case OP_NEXT:
                this.m[PC] = --this.m[this.m[RP]-1]<0?this.m[PC]+1:this.m[this.m[PC]];
                break;
        }
    };

    this.load = function (addr) {
        if (addr == RN) { return Math.floor(Math.random() * 0xffffffff); }
        if (addr == KY) { alert('STUB load KY'); }
        if (addr == CO) {
            alert('STUB load CO');
        }
        return this.m[addr];
    };

    this.stor = function (addr, value) {
        if (addr == CO) { console.log('DEBUG', addre, value); return; }
        if (addr == AU) {
            console.log('STUB stor AU: audio');
        }
        this.m[addr] = value;
    };

    this.drawPixel = function (x, y, c) {
        if ((c & 0xFF000000) != 0xFF000000)         { return; }
        if (x < 0 || x >= 320 || y < 0 || y >= 240) { return; }
        this.p[x + (y * 320)] = c;
    };

    this.drawTile = function (tile, px, py) {
        var i, y, x;
        tile &= ~GRID_Z_MASK;
        if (tile < 0) { return; }
        i = this.m[GT] + (tile * 8 * 8);
        for(y = 0; y < 8; y++) {
            for(x = 0; x < 8; x++) {
                this.drawPixel(x+px, y+py, this.m[i++]);
            }
        }
    };

    this.drawSprite = function (tile, status, px, py) {
        var y, x;
        if (status % 2 === 0) { return; }
        var w = (((status & 0x0F00) >>  8) + 1) << 3;
        var h = (((status & 0xF000) >> 12) + 1) << 3;
        var xd = 1, x0 = 0, x1 = w;
        var yd = 1, y0 = 0, y1 = h;
        if ((status & H_MIRROR_MASK) !== 0) { xd = -1; x0 = w - 1; x1 = -1; }
        if ((status & V_MIRROR_MASK) !== 0) { yd = -1; y0 = h - 1; y1 = -1; }
        var i = this.m[ST] + (tile * w * h);
        for(y = y0; y != y1; y += yd) {
            for(x = x0; x != x1; x += xd) {
                this.drawPixel(x+px, y+py, m[i++]);
            }
        }
    };

    this.drawGrid = function (hiz, scrollx, scrolly) {
        var i = this.m[GP], y, x;
        for(y = 0; y < 31; y++) {
            for(x = 0; x < 41; x++) {
                if (!hiz && (this.m[i] & GRID_Z_MASK) !== 0) { i++; continue; }
                if ( hiz && (this.m[i] & GRID_Z_MASK) === 0) { i++; continue; }
                this.drawTile(this.m[i++], x*8 - scrollx, y*8 - scrolly);
            }
            i += this.m[GS];
        }
    };

    this.sync = function () {
        var scrollx = this.m[SX];
        var scrolly = this.m[SY];
        var sprite, status, tile, px, py;
        java.util.Arrays.fill(p, this.m[CL]);
        drawGrid(false, scrollx, scrolly);
        for(sprite = 0; sprite < 1024; sprite += 4) {
            status = this.m[this.m[SP] + sprite    ];
            tile   = this.m[this.m[SP] + sprite + 1];
            px     = this.m[this.m[SP] + sprite + 2];
            py     = this.m[this.m[SP] + sprite + 3];
            this.drawSprite(tile, status, px - scrollx, py - scrolly);
        }
        this.drawGrid(true, scrollx, scrolly);
    };
}
