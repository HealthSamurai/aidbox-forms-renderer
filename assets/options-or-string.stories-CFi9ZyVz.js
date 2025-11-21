import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as t,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=c({linkId:"decimal-wc-slider-repeating-options-or-string",text:"Enter decimal value",type:"decimal",repeats:!0,control:"slider",answerConstraint:"optionsOrString",answerOption:p("decimal",[1.5,2,2.5])}),r=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/decimal/with item-control/slider/repeating/with answer-options",component:t,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:r},render:n=>i.jsx(t,{scenario:{name:"decimal-wc-slider-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-slider-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
