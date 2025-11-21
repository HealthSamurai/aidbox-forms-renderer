import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as o,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"time-wc-radio-button-non-repeating-options-or-string",text:"Select a time",type:"time",repeats:!1,control:"radio-button",answerConstraint:"optionsOrString",answerOption:p("time",["08:00:00","12:30:00","18:00:00"])}),t=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/time/with item-control/radio-button/non-repeating/with answer-options",component:o,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:t},render:n=>i.jsx(o,{scenario:{name:"time-wc-radio-button-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-radio-button-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const b=["OptionsOrString"];export{e as OptionsOrString,b as __namedExportsOrder,f as default};
