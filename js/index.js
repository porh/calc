(()=>{
    class calc {
        constructor(sel) {
            this.calcObj = document.querySelector(sel);
            this.displayM = this.calcObj.querySelector(".display .m");
            this.displayObj = this.calcObj.querySelector(".display .display");
            this.logObj = this.calcObj.querySelector(".log");
            this.m = 0;
            
            const basicOpersExec = {
                "+": (a,b)=> a+b,
                "-": (a,b)=> a-b,
                "×": (a,b)=> a*b,
                "÷": (a,b)=> a/b
            };
            const buttonsMFuncs = {
                "MC": ()=> {
                    this.m=0;
                    this.display = 0;
                },
                "MR": ()=> {
                    this.display = this.m;
                },
                "M+": ()=>{
                    this.m += this.display;
                },
                "M-": ()=>{
                    this.m -= this.display;
                },
                "MS": ()=>{
                    this.m = this.display;
                }
            };
            const buttonsNumFuncs = {
                "%": ()=>{
                    this.display = this.accumBuf * (this.display / 100);
                },
                "√": ()=>{
                    this.display = Math.sqrt(this.display);
                },
                "x²": ()=>{
                    this.display = Math.pow(this.display, 2);
                },
                "¹/x": ()=>{
                    this.display = 1/this.display;
                },
                "CE": ()=>{
                    this.display = 0;
                },
                "C": ()=>{
                    this.accumBuf = this.oper = this.display = 0;
                    this.log = '';
                    this.oper = '';
                    this.typingClear = true;
                    this.setOperBuf = false;
                },
                "←": ()=>{
                    const text = this.displayObj.innerText;
                    this.display = this.displayObj.innerText.substr(0,text.length-1);
                    if (this.displayObj.innerText === "") this.display = 0;
                },
                "±": ()=>{
                    this.display = -this.display;
                },
                ",": ()=>{
                    if (this.typingClear) {
                        this.display = 0;
                        this.typingClear = false;
                    }
                    this.display += ".";
                },
                "=": ()=>{
                    if (this.oper !== '') {
                        if (this.setOperBuf) {
                            this.operBuf = this.display;
                            this.setOperBuf = false;
                        }
                        this.accumBuf = basicOpersExec[this.oper](this.accumBuf,this.operBuf);
                        this.display = this.accumBuf;
                        this.log = "";
                    }
                }
            };
            buttonsNumFuncs["C"]();
            
            const basicOpersButtonsFunc = (evt)=>{
                if (this.setOperBuf && !this.typingClear) buttonsNumFuncs["="]();
                else this.accumBuf = this.display;
                this.oper = evt.target.textContent;
                this.setOperBuf = true;
                this.log = this.accumBuf + this.oper;
            }
            Object.keys(basicOpersExec).forEach((k)=> buttonsNumFuncs[k] = basicOpersButtonsFunc);
            
            const numButtonsFunc = (evt) => {
                if (this.typingClear) {
                    this.display = "";
                    this.typingClear = false;
                }
                this.display = this.displayObj.innerText + evt.target.innerText;
            };
            const dontClear = [];
            for(let i=0;i<10;i++) {
                buttonsNumFuncs[""+i] = numButtonsFunc;
                dontClear.push(""+i);
            }
            dontClear.push(",");
            dontClear.push("±");
            dontClear.push("←");
            
            const divAsButton = document.createElement('div');
            divAsButton.classList.add('nested');
            
            const mFuncBox = this.calcObj.querySelector(".memTools");
            const mCheckShow = () => this.displayM.innerText = this.m!=0?"M":"";
            const typingClear = () => this.typingClear = true;
            
            Object.keys(buttonsMFuncs).forEach((k)=>{
                let newDiv = divAsButton.cloneNode(false);
                newDiv.innerText = k;
                newDiv.addEventListener('click', buttonsMFuncs[k]);
                newDiv.addEventListener('click', mCheckShow);
                newDiv.addEventListener('click', typingClear);
                mFuncBox.appendChild(newDiv);
            });
            
            const numFuncBox = this.calcObj.querySelector(".numpad");
            [
                "%", "√", "x²", "¹/x", 
                "CE", "C", "←", "÷", 
                "7", "8", "9", "×", 
                "4", "5", "6", "-", 
                "1", "2", "3", "+", 
                "±", "0", ",", "="
            ]
            .forEach((k)=>{
                let newDiv = divAsButton.cloneNode(false);
                newDiv.innerText = k;
                newDiv.addEventListener('click', buttonsNumFuncs[k]);
                if (-1 == dontClear.indexOf(k)) newDiv.addEventListener('click', typingClear);
                numFuncBox.appendChild(newDiv);
            });
        }
        
        get display() {
            return parseFloat(this.displayObj.innerText);
        }
        
        set display(newValue) {
            this.displayObj.innerText = newValue;
            this.displayM.innerText = this.m!=0?"M":"";
        }
        
        get log() {
            return this.logObj.innerText;
        }
        
        set log(newValue) {
            this.logObj.innerText = newValue;
        }
    }
    new calc("#calcCont");
})();