import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as n,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=u({linkId:"integer-wc-radio-button-non-repeating-options-or-string",text:"Enter integer value",type:"integer",repeats:!1,control:"radio-button",answerConstraint:"optionsOrString",answerOption:p("integer",[1,2,3])}),r=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/integer/with item-control/radio-button/non-repeating/with answer-options",component:n,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:r},render:o=>i.jsx(n,{scenario:{name:"integer-wc-radio-button-non-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:o.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-radio-button-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const b=["OptionsOrString"];export{e as OptionsOrString,b as __namedExportsOrder,f as default};
