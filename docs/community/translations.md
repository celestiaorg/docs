---
sidebar_label: Docs translations
description: Learn how you can help translate Celestia's documentation.
---

# Community translation support

If you are a passionate Celestia community member who would like to contribute
to translating the documentation page, then this is the guide for you.

## Visit our Crowdin project

To get started, visit the
[Celestia Docs Crowdin project](https://crowdin.com/project/celestia-docs).

You will have to create an account and then you will be able to join the project
in order to begin your translation journey.

If your language isn't listed, request it on the
[`#translations` channel on our Discord server](https://discord.gg/celestiacommunity).

On Crowdin you can translate, comment on translations, and also give upvotes and
downvotes to existing translations.

Give your opinion on existing translations to ensure it is correct!

## Tips

Here are few tips to help you during your translation.

### Crowdin documentation

You can reference the
[official Crowdin documentation](https://support.crowdin.com/online-editor)
for more detailed guidance.

### Guide

#### Code

Some pages contain metadata and computer code.

It is important to keep in mind that William Shakespeare was an
English speaker...So was Alan Turing! That is why
you should not translate parts of the code "itself".

For instance, if you see metadata like `sidebar_label: Hello World`,
a French translation would be `sidebar_label: Salut tout le monde`.

Let's take another example, you wouldn't have to translate anything here:

```sh
cd $HOME
rm -rf celestia-app
git clone https://github.com/celestiaorg/celestia-app.git
cd celestia-app/
APP_VERSION=$(curl -s \
  https://api.github.com/repos/celestiaorg/celestia-app/releases/latest \
  | jq -r ".tag_name")
git checkout tags/$APP_VERSION -b $APP_VERSION
make install
```

Furthermore, you do not have to translate URLs into your local language.

#### Specific words

As you will translate innovative concepts, like Data Availability
Sampling, feel free to discuss about the best translation with the
rest of the community.

Also, be careful with date order, period and commas regarding
numbers from a language to another.

## Technical guidance for language managers in Crowdin

If you are the owner of a specific language in the Crowdin translation
efforts for Celestia, you are basically in charge of approving
submitted translations.

After you approve translations, you also need to test your changes.

You can do so with the following steps in your shell:

```sh
git clone https://github.com/celestiaorg/docs.git
cd docs
yarn
# This command creates updated files, pushes it to crowdin and
# pulls in all latest approved translations
yarn crowdin:sync
# Now you can build your specific translation locally. For example
# for Mandarin, you use `zh`
yarn run start -- --locale zh
```

This allows you to start the docs locally with your translations
added. Test this on your computer to ensure there are no issues
in your translations from crowdin. Errors cause the whole docs to
not update and slows documentation process so it is advised for you
to always test your translations before we add them to the docs.
