import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"decimal-wc-text-box-non-repeating-options-or-type",text:"Enter decimal value",type:"decimal",repeats:!1,control:"text-box",answerConstraint:"optionsOrType",answerOption:c("decimal",[1.5,2,2.5])}),o=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/decimal/with item-control/text-box/non-repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:o},render:n=>a.jsx(t,{scenario:{name:"decimal-wc-text-box-non-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-text-box-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,S as default};
