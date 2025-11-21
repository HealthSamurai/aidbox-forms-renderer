import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as r,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=c({linkId:"decimal-wc-text-box-repeating-options-or-string",text:"Enter decimal value",type:"decimal",repeats:!0,control:"text-box",answerConstraint:"optionsOrString",answerOption:p("decimal",[1.5,2,2.5])}),t=JSON.stringify(o.form.questionnaire,null,2),x={title:"Question/decimal/with item-control/text-box/repeating/with answer-options",component:r,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:t},render:n=>i.jsx(r,{scenario:{name:"decimal-wc-text-box-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-text-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,x as default};
