import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"decimal-wc-slider-non-repeating-options-or-type",text:"Enter decimal value",type:"decimal",repeats:!1,control:"slider",answerConstraint:"optionsOrType",answerOption:c("decimal",[1.5,2,2.5])}),o=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/decimal/with item-control/slider/non-repeating/with answer-options",component:r,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:o},render:n=>s.jsx(r,{scenario:{name:"decimal-wc-slider-non-repeating-options-or-type",title:"options or type",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-slider-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOrType"];export{e as OptionsOrType,g as __namedExportsOrder,f as default};
