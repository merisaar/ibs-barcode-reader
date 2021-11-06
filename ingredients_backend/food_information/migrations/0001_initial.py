# Generated by Django 3.2.9 on 2021-11-06 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FoodEntry',
            fields=[
                ('ean', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('ingredients', models.CharField(max_length=200)),
                ('allergens', models.CharField(max_length=200)),
            ],
        ),
    ]