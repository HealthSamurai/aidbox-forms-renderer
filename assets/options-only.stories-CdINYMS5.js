import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as l,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=l({linkId:"decimal-wc-text-box-repeating-options-only",text:"Enter decimal value",type:"decimal",repeats:!0,control:"text-box",answerConstraint:"optionsOnly",answerOption:c("decimal",[1.5,2,2.5])}),o=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/decimal/with item-control/text-box/repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:r=>a.jsx(t,{scenario:{name:"decimal-wc-text-box-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-text-box-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,S as default};
