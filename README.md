# chip8-emulator
A Chip-8 emulator written in JavaScript.
#### [Try demo](https://elazarbsh.github.io/chip8-emulator/)
### Keyboard Mapping
| Original Chip8 Key | Mapped Key |
| --- | --- |
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| C | 4 |
| 4 | Q |
| 5 | W |
| 6 | E |
| D | R |
| 7 | A |
| 8 | S |
| 9 | D |
| E | F |
| A | Z |
| 0 | X |
| B | C |
| F | V |

## Getting Started
Clone the repository and install dependencies.
```bash
git clone https://github.com/Elazarbsh/chip8-emulator.git
cd chip8-emulator
npm install
```
### Development
Launch a local development server on port 8080.
```bash
npm start
```

### Testing
Run tests
```bash
npm run test
```

### Deployment
Build and bundle the code, output files will be located in the `dist` directory.
```bash
npm run build
```

## Instruction Set
The emulator implements the instruction set defined in [Cowgod's Chip-8 Technical Reference](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM).
