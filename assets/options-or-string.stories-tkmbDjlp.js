import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=c({linkId:"boolean-wc-check-box-repeating-options-or-string",text:"Boolean question",type:"boolean",repeats:!0,control:"check-box",answerConstraint:"optionsOrString",answerOption:p("boolean",[!0,!1])}),o=JSON.stringify(n.form.questionnaire,null,2),b={title:"Question/boolean/with item-control/check-box/repeating/with answer-options",component:r,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:o},render:t=>s.jsx(r,{scenario:{name:"boolean-wc-check-box-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-check-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,b as default};
