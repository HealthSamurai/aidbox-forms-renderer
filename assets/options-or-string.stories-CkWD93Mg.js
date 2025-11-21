import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c as d,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=d({linkId:"coding-wc-radio-button-repeating-options-or-string",text:"Choose a code",type:"coding",repeats:!0,control:"radio-button",answerConstraint:"optionsOrString",answerOption:c("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),o=JSON.stringify(r.form.questionnaire,null,2),b={title:"Question/coding/with item-control/radio-button/repeating/with answer-options",component:t,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:o},render:n=>s.jsx(t,{scenario:{name:"coding-wc-radio-button-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-radio-button-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,b as default};
