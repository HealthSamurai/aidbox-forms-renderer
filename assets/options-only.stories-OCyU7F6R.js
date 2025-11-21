import{j as i}from"./index-BsWNCus6.js";import{b as a,a as s,N as n,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=u({linkId:"integer-wc-radio-button-repeating-options-only",text:"Enter integer value",type:"integer",repeats:!0,control:"radio-button",answerConstraint:"optionsOnly",answerOption:p("integer",[1,2,3])}),o=JSON.stringify(t.form.questionnaire,null,2),S={title:"Question/integer/with item-control/radio-button/repeating/with answer-options",component:n,parameters:s,argTypes:a},e={name:"options only",args:{questionnaireSource:o},render:r=>i.jsx(n,{scenario:{name:"integer-wc-radio-button-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-radio-button-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,S as default};
