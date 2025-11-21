import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as o,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=c({linkId:"decimal-wc-check-box-repeating-options-or-string",text:"Enter decimal value",type:"decimal",repeats:!0,control:"check-box",answerConstraint:"optionsOrString",answerOption:p("decimal",[1.5,2,2.5])}),r=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/decimal/with item-control/check-box/repeating/with answer-options",component:o,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:r},render:n=>i.jsx(o,{scenario:{name:"decimal-wc-check-box-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-check-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOrString"];export{e as OptionsOrString,x as __namedExportsOrder,f as default};
