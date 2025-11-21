import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c as p,m}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"time-wc-spinner-non-repeating-options-or-type",text:"Select a time",type:"time",repeats:!1,control:"spinner",answerConstraint:"optionsOrType",answerOption:m("time",["08:00:00","12:30:00","18:00:00"])}),n=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/time/with item-control/spinner/non-repeating/with answer-options",component:o,parameters:a,argTypes:i},e={name:"options or type",args:{questionnaireSource:n},render:r=>s.jsx(o,{scenario:{name:"time-wc-spinner-non-repeating-options-or-type",title:"options or type",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-spinner-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOrType"];export{e as OptionsOrType,g as __namedExportsOrder,f as default};
