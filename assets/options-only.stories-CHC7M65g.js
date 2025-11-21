import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=l({linkId:"string-wc-slider-repeating-options-only",text:"Enter text",type:"string",repeats:!0,control:"slider",answerConstraint:"optionsOnly",answerOption:p("string",["Alpha","Bravo","Charlie"])}),n=JSON.stringify(o.form.questionnaire,null,2),S={title:"Question/string/with item-control/slider/repeating/with answer-options",component:r,parameters:a,argTypes:i},e={name:"options only",args:{questionnaireSource:n},render:t=>s.jsx(r,{scenario:{name:"string-wc-slider-repeating-options-only",title:"options only",build:()=>o},questionnaireSource:t.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-slider-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,S as default};
