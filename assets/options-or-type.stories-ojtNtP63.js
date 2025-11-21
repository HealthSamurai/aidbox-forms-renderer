import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as p,m}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"time-wc-text-box-non-repeating-options-or-type",text:"Select a time",type:"time",repeats:!1,control:"text-box",answerConstraint:"optionsOrType",answerOption:m("time",["08:00:00","12:30:00","18:00:00"])}),t=JSON.stringify(r.form.questionnaire,null,2),y={title:"Question/time/with item-control/text-box/non-repeating/with answer-options",component:o,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:t},render:n=>s.jsx(o,{scenario:{name:"time-wc-text-box-non-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-text-box-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,y as default};
