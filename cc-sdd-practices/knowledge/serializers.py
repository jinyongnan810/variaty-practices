from rest_framework import serializers

from .models import KnowledgeEntry, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "created_at"]


class KnowledgeSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list,
        write_only=True,
    )

    class Meta:
        model = KnowledgeEntry
        fields = ["id", "title", "body", "tags", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["tags"] = TagSerializer(instance.tags.all(), many=True).data
        return ret

    def create(self, validated_data):
        tag_names = validated_data.pop("tags", [])
        entry = KnowledgeEntry.objects.create(**validated_data)
        self._set_tags(entry, tag_names)
        return entry

    def update(self, instance, validated_data):
        tag_names = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tag_names is not None:
            self._set_tags(instance, tag_names)
        return instance

    def _set_tags(self, entry, tag_names):
        tags = [Tag.objects.get_or_create(name=name)[0] for name in tag_names]
        entry.tags.set(tags)
