import { AnimationCurveT, KeyframeT, Matrix4, Object3D, PrefabAvatarData, PrefabBoneData, PropertyAnimationClip, Quaternion, ValueEnumType, Vector3 } from "../../..";
import { GLTF_Info } from "./GLTFInfo";
import { GLTFSubParser } from "./GLTFSubParser";

export class GLTFSubParserSkeleton {
    protected gltf: GLTF_Info;
    protected subParser: GLTFSubParser;

    constructor(subParser: GLTFSubParser) {
        this.gltf = subParser.gltf;
        this.subParser = subParser;
    }

    public parse(skeletonID: number): PrefabAvatarData {
        let avatarData: PrefabAvatarData = new PrefabAvatarData();
        avatarData.name = 'Id:' + skeletonID;
        avatarData.count = 0;
        avatarData.boneData = [];
        avatarData.boneMap = new Map<string, PrefabBoneData>();
        this.buildSkeleton(avatarData, undefined, skeletonID);
        return avatarData;
    }

    public parseSkeletonAnimation(avatarData: PrefabAvatarData, animation): PropertyAnimationClip {
        let result: PropertyAnimationClip = new PropertyAnimationClip();
        result.clipName = animation.name;
        result.useSkeletonPos = false;
        result.useSkeletonScale = false;

        for (let channel of animation.channels) {
            let sampler = animation.samplers[channel.sampler];
            const inputAccessor = this.subParser.parseAccessor(sampler.input);
            const outputAccessor = this.subParser.parseAccessor(sampler.output);
            let nodeId = channel.target.node;
            let property = channel.target.path;
            let node = this.gltf.nodes[nodeId];
            if (!node) {
                continue;
            }
            if (!avatarData.boneMap.has(node.name)) {
                continue;
            }
            let bone = avatarData.boneMap.get(node.name);

            switch (property) {
                case 'scale':
                    {
                        let animationCurveT = new AnimationCurveT(outputAccessor.numComponents);
                        animationCurveT.path = "";
                        animationCurveT.attribute = "";
                        animationCurveT.propertys = animationCurveT.attribute.split(".");
                        animationCurveT.preInfinity = 0;
                        animationCurveT.postInfinity = 0;
                        animationCurveT.rotationOrder = 0;
                        result.useSkeletonScale = true;
                        result.scaleCurves.set(bone.bonePath, animationCurveT);

                        for (let i = 0; i < inputAccessor.data.length; i++) {
                            const t = inputAccessor.data[i];
                            const offset = i * outputAccessor.numComponents;

                            let keyframe = new KeyframeT(0);
                            keyframe.time = t;

                            const v = new Vector3().set(
                                outputAccessor.data[offset + 0], 
                                outputAccessor.data[offset + 1], 
                                outputAccessor.data[offset + 2]
                            );

                            keyframe.split(ValueEnumType.vector3, v, "value");

                            // keyframe.split(ValueEnumType.single, 0, "inSlope");
                            // keyframe.split(ValueEnumType.single, 0, "outSlope");
                            // keyframe.tangentMode = 0;
                            // keyframe.weightedMode = 0;
                            // keyframe.split(ValueEnumType.single, 1, "inWeight");
                            // keyframe.split(ValueEnumType.single, 1, "outWeight");

                            animationCurveT.addKeyFrame(keyframe);
                        }
                    }
                    break;
                case 'rotation':
                    {
                        let animationCurveT = new AnimationCurveT(outputAccessor.numComponents);
                        animationCurveT.path = "";
                        animationCurveT.attribute = "";
                        animationCurveT.propertys = animationCurveT.attribute.split(".");
                        animationCurveT.preInfinity = 0;
                        animationCurveT.postInfinity = 0;
                        animationCurveT.rotationOrder = 0;
                        result.rotationCurves.set(bone.bonePath, animationCurveT);

                        for (let i = 0; i < inputAccessor.data.length; i++) {
                            const t = inputAccessor.data[i];
                            const offset = i * outputAccessor.numComponents;

                            let keyframe = new KeyframeT(0);
                            keyframe.time = t;

                            const v = new Quaternion().set(
                                outputAccessor.data[offset + 0], 
                                outputAccessor.data[offset + 1], 
                                outputAccessor.data[offset + 2],
                                outputAccessor.data[offset + 3],
                            );

                            keyframe.split(ValueEnumType.quaternion, v, "value");

                            // keyframe.split(ValueEnumType.single, 0, "inSlope");
                            // keyframe.split(ValueEnumType.single, 0, "outSlope");
                            // keyframe.tangentMode = 0;
                            // keyframe.weightedMode = 0;
                            // keyframe.split(ValueEnumType.single, 1, "inWeight");
                            // keyframe.split(ValueEnumType.single, 1, "outWeight");

                            animationCurveT.addKeyFrame(keyframe);
                        }
                    }
                    break;
                case 'translation':
                    {
                        let animationCurveT = new AnimationCurveT(outputAccessor.numComponents);
                        animationCurveT.path = "";
                        animationCurveT.attribute = "";
                        animationCurveT.propertys = animationCurveT.attribute.split(".");
                        animationCurveT.preInfinity = 0;
                        animationCurveT.postInfinity = 0;
                        animationCurveT.rotationOrder = 0;
                        result.useSkeletonPos = true;
                        result.positionCurves.set(bone.bonePath, animationCurveT);

                        for (let i = 0; i < inputAccessor.data.length; i++) {
                            const t = inputAccessor.data[i];
                            const offset = i * outputAccessor.numComponents;

                            let keyframe = new KeyframeT(0);
                            keyframe.time = t;

                            const v = new Vector3().set(
                                outputAccessor.data[offset + 0], 
                                outputAccessor.data[offset + 1], 
                                outputAccessor.data[offset + 2]
                            );

                            keyframe.split(ValueEnumType.vector3, v, "value");

                            // keyframe.split(ValueEnumType.single, 0, "inSlope");
                            // keyframe.split(ValueEnumType.single, 0, "outSlope");
                            // keyframe.tangentMode = 0;
                            // keyframe.weightedMode = 0;
                            // keyframe.split(ValueEnumType.single, 1, "inWeight");
                            // keyframe.split(ValueEnumType.single, 1, "outWeight");

                            animationCurveT.addKeyFrame(keyframe);
                        }
                    }
                    break;
            }
        }
        return result;
    }

    private buildSkeleton(avatarData: PrefabAvatarData, parent: PrefabBoneData, nodeId: number) {
        let node = this.gltf.nodes[nodeId];
        if (!node.name) {
            node.name = 'Bone' + avatarData.count;
        }

        let boneData = new PrefabBoneData();
        boneData.boneName = node.name;
        boneData.bonePath = parent ? parent.bonePath + '/' + node.name : node.name;
        boneData.parentBoneName = parent ? parent.boneName : "";

        boneData.boneID = avatarData.count++;
        boneData.parentBoneID = parent ? parent.boneID : -1;

        boneData.instanceID = "";
        boneData.parentInstanceID = "";

        boneData.s = new Vector3(1, 1, 1);
        if (node.scale) {
            boneData.s.set(node.scale[0], node.scale[1], node.scale[2]);
        }

        boneData.q = new Quaternion();
        if (node.rotation) {
            boneData.q.set(node.rotation[0], node.rotation[1], node.rotation[2], node.rotation[3]);
        }

        boneData.t = new Vector3();
        if (node.translation) {
            boneData.t.set(node.translation[0], node.translation[1], node.translation[2]);
        }

        avatarData.boneData.push(boneData);
        avatarData.boneMap.set(boneData.boneName, boneData);

        if (node.children) {
            for (let children of node.children) {
                this.buildSkeleton(avatarData, boneData, children);
            }
        }
    }

}
