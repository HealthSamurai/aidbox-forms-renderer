import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as r,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=c({linkId:"decimal-wc-check-box-non-repeating-options-or-string",text:"Enter decimal value",type:"decimal",repeats:!1,control:"check-box",answerConstraint:"optionsOrString",answerOption:p("decimal",[1.5,2,2.5])}),o=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/decimal/with item-control/check-box/non-repeating/with answer-options",component:r,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:o},render:t=>i.jsx(r,{scenario:{name:"decimal-wc-check-box-non-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-check-box-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOrString"];export{e as OptionsOrString,x as __namedExportsOrder,f as default};
