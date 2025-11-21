import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"integer-wc-text-box-repeating-options-or-type",text:"Enter integer value",type:"integer",repeats:!0,control:"text-box",answerConstraint:"optionsOrType",answerOption:u("integer",[1,2,3])}),t=JSON.stringify(o.form.questionnaire,null,2),y={title:"Question/integer/with item-control/text-box/repeating/with answer-options",component:r,parameters:a,argTypes:i},e={name:"options or type",args:{questionnaireSource:t},render:n=>s.jsx(r,{scenario:{name:"integer-wc-text-box-repeating-options-or-type",title:"options or type",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-text-box-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOrType"];export{e as OptionsOrType,S as __namedExportsOrder,y as default};
