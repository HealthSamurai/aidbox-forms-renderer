import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=c({linkId:"coding-wc-text-box-repeating-options-or-string",text:"Choose a code",type:"coding",repeats:!0,control:"text-box",answerConstraint:"optionsOrString",answerOption:p("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),o=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/coding/with item-control/text-box/repeating/with answer-options",component:t,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:o},render:n=>s.jsx(t,{scenario:{name:"coding-wc-text-box-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-text-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const b=["OptionsOrString"];export{e as OptionsOrString,b as __namedExportsOrder,S as default};
