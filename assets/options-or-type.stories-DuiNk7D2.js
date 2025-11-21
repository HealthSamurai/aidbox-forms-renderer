import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as r,c as p,m as d}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"decimal-wc-drop-down-non-repeating-options-or-type",text:"Enter decimal value",type:"decimal",repeats:!1,control:"drop-down",answerConstraint:"optionsOrType",answerOption:d("decimal",[1.5,2,2.5])}),o=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/decimal/with item-control/drop-down/non-repeating/with answer-options",component:r,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:o},render:t=>a.jsx(r,{scenario:{name:"decimal-wc-drop-down-non-repeating-options-or-type",title:"options or type",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-drop-down-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,S as default};
