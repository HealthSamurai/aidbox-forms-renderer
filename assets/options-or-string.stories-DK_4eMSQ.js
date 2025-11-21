import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as r,c as p,m}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"time-wc-spinner-non-repeating-options-or-string",text:"Select a time",type:"time",repeats:!1,control:"spinner",answerConstraint:"optionsOrString",answerOption:m("time",["08:00:00","12:30:00","18:00:00"])}),n=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/time/with item-control/spinner/non-repeating/with answer-options",component:r,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:n},render:o=>i.jsx(r,{scenario:{name:"time-wc-spinner-non-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:o.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-spinner-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
