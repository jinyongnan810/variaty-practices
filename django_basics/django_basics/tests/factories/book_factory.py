import factory


class BookFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "django_basics.Book"

    title = factory.Faker("sentence", nb_words=4)
    author = factory.Faker("name")
