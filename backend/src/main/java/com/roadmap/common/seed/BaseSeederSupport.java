package com.roadmap.common.seed;

import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.NodeResource;
import com.roadmap.modules.nodes.domain.model.NodeType;
import com.roadmap.modules.nodes.domain.model.RoadmapEdge;
import com.roadmap.modules.nodes.domain.model.RoadmapText;
import com.roadmap.modules.nodes.domain.model.Section;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapEdgeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapTextRepository;
import com.roadmap.modules.nodes.domain.repository.SectionRepository;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class BaseSeederSupport implements RoadmapDataSeeder {

    protected final RoadmapRepository roadmapRepository;
    protected final SectionRepository sectionRepository;
    protected final NodeRepository nodeRepository;
    protected final RoadmapTextRepository textRepository;
    protected final RoadmapEdgeRepository edgeRepository;

    protected Section saveSection(Roadmap roadmap, String title, double x, double y, Double width, Double height, int sortOrder) {
        Section section = Section.builder()
                .roadmap(roadmap)
                .title(title)
                .positionX(x)
                .positionY(y)
                .width(width)
                .height(height)
                .sortOrder(sortOrder)
                .build();
        return sectionRepository.save(section);
    }

    protected Node saveNode(Roadmap roadmap,
                            String title,
                            NodeType type,
                            String content,
                            boolean isRequired,
                            Node parent,
                            double x,
                            double y,
                            List<NodeResource> resources) {
        Node node = Node.builder()
                .roadmap(roadmap)
                .title(title)
                .type(type)
                .content(content)
                .isRequired(isRequired)
                .parentNode(parent)
                .positionX(x)
                .positionY(y)
                .resources(new ArrayList<>())
                .build();

        if (resources != null) {
            for (NodeResource res : resources) {
                res.setNode(node);
                node.getResources().add(res);
            }
        }

        return nodeRepository.save(node);
    }

    protected RoadmapEdge saveEdge(Roadmap roadmap, Node sourceNode, Node targetNode, String sourceHandle, String targetHandle) {
        RoadmapEdge edge = RoadmapEdge.builder()
                .roadmap(roadmap)
                .sourceNode(sourceNode)
                .targetNode(targetNode)
                .sourceHandle(sourceHandle)
                .targetHandle(targetHandle)
                .build();
        return edgeRepository.save(edge);
    }

    protected RoadmapText saveText(Roadmap roadmap, String content, double x, double y) {
        RoadmapText text = RoadmapText.builder()
                .roadmap(roadmap)
                .content(content)
                .positionX(x)
                .positionY(y)
                .build();
        return textRepository.save(text);
    }

    protected NodeResource createResource(String title, String url, String type) {
        return NodeResource.builder()
                .title(title)
                .url(url)
                .type(type)
                .build();
    }
}
