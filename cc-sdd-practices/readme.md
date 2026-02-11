## Steps
```bash
# Install
npx cc-sdd@latest --claude --lang en
# Start claude
claude
# Create steering files
/kiro:steering
# Create spec files
/kiro:spec-init This is a WiKi for myself. Knowledge should support markdown and support crud. authentication should be bearer token. there should be tags link to each knowledge and should support searching by keywords. 
# Add requirements
# Change spec.json's requirements to approved
/kiro:spec-requirements personal-wiki-knowledge-base
# Add designs
# Change spec.json's design to approved
/kiro:spec-design personal-wiki-knowledge-base 
# Create tasks
# Change spec.json's task to approved
/kiro:spec-tasks personal-wiki-knowledge-base 

# Start implementing
/kiro:spec-impl personal-wiki-knowledge-base 1
/kiro:spec-impl personal-wiki-knowledge-base 2
/kiro:spec-impl personal-wiki-knowledge-base 3
/kiro:spec-impl personal-wiki-knowledge-base 4
/kiro:spec-impl personal-wiki-knowledge-base 5
```