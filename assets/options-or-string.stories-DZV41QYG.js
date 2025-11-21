import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"string-wc-slider-repeating-options-or-string",text:"Enter text",type:"string",repeats:!0,control:"slider",answerConstraint:"optionsOrString",answerOption:u("string",["Alpha","Bravo","Charlie"])}),e=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/string/with item-control/slider/repeating/with answer-options",component:t,parameters:a,argTypes:i},r={name:"options or string",args:{questionnaireSource:e},render:o=>s.jsx(t,{scenario:{name:"string-wc-slider-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:o.questionnaireSource,defaultSource:e})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-slider-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...r.parameters?.docs?.source}}};const w=["OptionsOrString"];export{r as OptionsOrString,w as __namedExportsOrder,f as default};
