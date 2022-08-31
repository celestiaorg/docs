---
sidebar_label : Docs Translations
---

# Community Translation Support

If you are a passionate Celestia community member who would like to contribute
to translating the documentation page, then this is the guide for you.

## Visit our Crowdin project

Go to the Crowdin project [here](https://crowdin.com/project/celestia-docs).

You will have to create an account and then you will be able to join the project
in order to begin your translation journey.

If you don't see your language, feel free to ask for it on discord, [here](https://discord.gg/celestiacommunity).

On Crowdin you can translate, comment translations but also give upvotes and
downvotes to translations.

Give your opinion!

## Tips

Here are few tips to help you during your translation.

### Crowdin documentation

Official Crowdin's documentaton is available [here](https://support.crowdin.com/online-editor).

## Guide

### Code

Some pages contain metadata and computer code.

It is important to keep in mind that William Shakespeare was an
English speaker...So was Alan Turing! That is why
you should not translate parts of the code "itself".

For instance, if you see metadata like ```sidebar_label : Hello World```,
a French translation would be ```sidebar_label : Salut tout le monde```.

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

You don't have to translate URLs in your language.

### Specific words

As you will translate innovative concepts, like Data Availability
Sampling, feel free to discuss about the best translation with the
rest of the community.

Also be careful with date order, period and commas regarding
numbers from a language to another.
