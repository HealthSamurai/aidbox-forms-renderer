import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=l({linkId:"decimal-wc-drop-down-non-repeating-options-only",text:"Enter decimal value",type:"decimal",repeats:!1,control:"drop-down",answerConstraint:"optionsOnly",answerOption:p("decimal",[1.5,2,2.5])}),o=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/decimal/with item-control/drop-down/non-repeating/with answer-options",component:n,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:t=>a.jsx(n,{scenario:{name:"decimal-wc-drop-down-non-repeating-options-only",title:"options only",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-drop-down-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,S as default};
