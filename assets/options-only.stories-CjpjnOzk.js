import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=c({linkId:"decimal-wc-check-box-repeating-options-only",text:"Enter decimal value",type:"decimal",repeats:!0,control:"check-box",answerConstraint:"optionsOnly",answerOption:l("decimal",[1.5,2,2.5])}),o=JSON.stringify(t.form.questionnaire,null,2),g={title:"Question/decimal/with item-control/check-box/repeating/with answer-options",component:n,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:r=>a.jsx(n,{scenario:{name:"decimal-wc-check-box-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-check-box-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,g as default};
